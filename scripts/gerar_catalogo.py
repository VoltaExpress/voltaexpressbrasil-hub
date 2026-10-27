"""Gera data/conteudo.json — o catálogo público do Hub — a partir das pastas, sem edição manual.

Cada material recebe:
- formato    (imagem | video | codigo | documento) — pela extensão
- finalidade (relatorio | dashboard | demonstracao | pesquisa | analise | explicacao | marca) — pela pasta
- persona    (caminhoneiro | embarcador | institucional) — pela pasta
- titulo / resumo / fonte / data — da curadoria (data/curadoria.json) ou deduzidos
- duplicado_de — quando o conteúdo é idêntico a outro arquivo (mesmo hash SHA-1)

A curadoria (data/curadoria.json) é o único arquivo editado à mão:
  "pastas":   regras por prefixo de pasta (a regra mais específica vence)
  "arquivos": ajustes por arquivo (título, resumo, publico: false para esconder)
  "links":    canais oficiais (redes sociais, GitHub)
Uso: python scripts/gerar_catalogo.py
"""
from __future__ import annotations

import datetime as dt
import subprocess
from pathlib import Path

from comum import ASSETS, CODIGO, DADOS, IMAGENS, RAIZ, VIDEOS, eh_privado, gravar_json, ler_json, rel, sha1

FORMATOS = {**{e: "imagem" for e in IMAGENS}, **{e: "video" for e in VIDEOS}, **{e: "codigo" for e in CODIGO},
            ".pdf": "documento", ".docx": "documento", ".xlsx": "planilha", ".csv": "planilha", ".md": "texto"}


def regra_da_pasta(caminho: str, pastas: dict) -> dict:
    """Combina as regras de todos os prefixos que casam, do mais geral ao mais específico."""
    regra: dict = {}
    for prefixo in sorted(pastas, key=len):
        if caminho == prefixo or caminho.startswith(prefixo + "/"):
            regra.update(pastas[prefixo])
    return regra


def data_do_arquivo(caminho: Path) -> str:
    """Data do último commit que tocou o arquivo; se não houver, a data de modificação."""
    saida = subprocess.run(["git", "log", "-1", "--format=%cs", "--", str(caminho)],
                           cwd=RAIZ, capture_output=True, text=True, check=False).stdout.strip()
    return saida or dt.date.fromtimestamp(caminho.stat().st_mtime).isoformat()


def titulo_padrao(caminho: Path) -> str:
    return caminho.stem.replace("-", " ").replace("_", " ").strip().capitalize()


def main() -> None:
    curadoria = ler_json(DADOS / "curadoria.json", {"pastas": {}, "arquivos": {}, "links": []})
    midia = ler_json(DADOS / "midia.json", {}) or {}
    itens, por_hash, ocultos = [], {}, 0

    for arquivo in sorted(ASSETS.rglob("*")):
        if not arquivo.is_file() or arquivo.name.startswith("."):
            continue
        caminho = rel(arquivo)
        formato = FORMATOS.get(arquivo.suffix.lower())
        if eh_privado(caminho) or formato is None:
            continue
        regra = regra_da_pasta(caminho, curadoria["pastas"])
        ajuste = curadoria["arquivos"].get(caminho, {})
        if ajuste.get("publico", regra.get("publico", True)) is False:
            ocultos += 1
            continue

        impressao = sha1(arquivo)
        item = {
            "id": caminho.removeprefix("assets/"),
            "titulo": ajuste.get("titulo") or titulo_padrao(arquivo),
            "resumo": ajuste.get("resumo", ""),
            "formato": formato,
            "finalidade": ajuste.get("finalidade", regra.get("finalidade", "marca")),
            "persona": ajuste.get("persona", regra.get("persona", "institucional")),
            "colecao": regra.get("colecao", ""),
            "fonte": ajuste.get("fonte", regra.get("fonte", "Acervo Volta Express")),
            "data": ajuste.get("data") or data_do_arquivo(arquivo),
            "arquivo": caminho,
            "bytes": arquivo.stat().st_size,
        }
        derivado = midia.get(caminho, {})
        for chave in ("mini", "grande", "capa"):
            if chave in derivado:
                item[chave] = derivado[chave]["arquivo"]
        for chave in ("largura", "altura", "duracao_s"):
            if chave in derivado:
                item[chave] = derivado[chave]
        if "youtube" in ajuste:
            item["youtube"] = ajuste["youtube"]
        if impressao in por_hash:
            item["duplicado_de"] = por_hash[impressao]
        else:
            por_hash[impressao] = item["id"]
        itens.append(item)

    links = curadoria.get("links", [])
    resumo = {
        "gerado_em": dt.date.today().isoformat(),
        "total": len(itens),
        "duplicados": sum(1 for i in itens if "duplicado_de" in i),
        "ocultos_pela_curadoria": ocultos,
        "por_formato": {}, "por_finalidade": {}, "por_persona": {},
    }
    for item in itens:
        if "duplicado_de" in item:
            continue
        for chave in ("formato", "finalidade", "persona"):
            grupo = resumo[f"por_{chave}"]
            grupo[item[chave]] = grupo.get(item[chave], 0) + 1
    gravar_json(DADOS / "conteudo.json", {"resumo": resumo, "itens": itens, "links": links})
    print(f"{len(itens)} materiais ({resumo['duplicados']} duplicados, {ocultos} ocultos) · {resumo['por_finalidade']}")


if __name__ == "__main__":
    main()
