"""Gera data/relatorios.json + data/relatorios/<id>.html a partir dos .md dos 3 projetos.

Os relatórios continuam sendo escritos em Markdown dentro de cada projeto (fonte única);
o Hub só publica uma cópia convertida em HTML, com data e caminho de origem.
Documentos com credenciais ou dados de teste (DEMONSTRACAO*.md) NUNCA entram na lista.
Requisito: pacote `markdown`.
Uso: python scripts/gerar_relatorios.py
"""
from __future__ import annotations

import datetime as dt
import html
import re
import subprocess

import markdown

from comum import DADOS, RAIZ, VEB, gravar_json

# id, projeto, caminho relativo a C:\veb, tipo (relatorio | analise | explicacao)
DOCUMENTOS = [
    ("landing-relatorio", "Landing", "voltaexpressbrasil/docs/RELATORIO.md", "relatorio"),
    ("landing-design-system", "Landing", "voltaexpressbrasil/docs/DESIGN-SYSTEM.md", "explicacao"),
    ("landing-decisoes", "Landing", "voltaexpressbrasil/docs/DECISOES.md", "analise"),
    ("plataforma-relatorio", "Plataforma", "voltaexpress/docs/RELATORIO.md", "relatorio"),
    ("plataforma-arquitetura", "Plataforma", "voltaexpress/docs/ARQUITETURA.md", "explicacao"),
    ("plataforma-match", "Plataforma", "voltaexpress/docs/MATCH.md", "explicacao"),
    ("plataforma-roadmap", "Plataforma", "voltaexpress/docs/ROADMAP.md", "analise"),
    ("plataforma-decisoes", "Plataforma", "voltaexpress/docs/DECISOES.md", "analise"),
    ("hub-relatorio", "Hub", "voltaexpressbrasil-hub/docs/RELATORIO.md", "relatorio"),
]
PROIBIDOS = re.compile(r"DEMONSTRACAO|AMBIENTE-LOCAL|\.env", re.I)


def data_git(arquivo) -> str:
    saida = subprocess.run(["git", "log", "-1", "--format=%cs", "--", arquivo.name],
                           cwd=arquivo.parent, capture_output=True, text=True, check=False).stdout.strip()
    return saida or dt.date.fromtimestamp(arquivo.stat().st_mtime).isoformat()


def primeiro_paragrafo(texto: str) -> str:
    for bloco in re.split(r"\n\s*\n", texto):
        bloco = bloco.strip()
        if bloco and not bloco.startswith(("#", "|", "```", "-", "*", "<")):
            limpo = re.sub(r"[>*_`]", "", bloco).replace("\n", " ")
            return (limpo[:220] + "…") if len(limpo) > 220 else limpo
    return ""


def main() -> None:
    destino = DADOS / "relatorios"
    destino.mkdir(parents=True, exist_ok=True)
    lista = []
    for ident, projeto, caminho, tipo in DOCUMENTOS:
        assert not PROIBIDOS.search(caminho), caminho
        arquivo = VEB / caminho
        if not arquivo.exists():
            print(f"aviso: {caminho} não encontrado; ignorado")
            continue
        texto = arquivo.read_text(encoding="utf-8")
        titulo = next((l.lstrip("# ").strip() for l in texto.splitlines() if l.startswith("# ")), arquivo.stem)
        corpo = re.sub(r"^# .*\n", "", texto, count=1)  # o título vai no cabeçalho do Hub
        # HTML do Markdown: blocos de HTML cru são escapados (o Hub não executa nada vindo dos .md)
        corpo = re.sub(r"<(/?)(script|iframe|style)", lambda m: html.escape(m.group(0)), corpo, flags=re.I)
        conteudo = markdown.markdown(corpo, extensions=["tables", "fenced_code", "sane_lists"])
        (destino / f"{ident}.html").write_text(conteudo + "\n", encoding="utf-8", newline="\n")
        lista.append({
            "id": ident, "projeto": projeto, "tipo": tipo, "titulo": titulo,
            "resumo": primeiro_paragrafo(corpo), "fonte": caminho, "atualizado": data_git(arquivo),
            "palavras": len(re.findall(r"\w+", texto)), "arquivo": f"data/relatorios/{ident}.html",
        })
    gravar_json(DADOS / "relatorios.json", {"gerado_em": dt.date.today().isoformat(), "itens": lista})
    print(len(lista), "documentos:", ", ".join(i["id"] for i in lista))


if __name__ == "__main__":
    main()
