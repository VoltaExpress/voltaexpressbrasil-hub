"""Valida os dados do Hub antes de publicar (roda também no GitHub Actions).

1. Cada data/<nome>.json contra schemas/<nome>.schema.json (JSON Schema draft-07).
2. Todo arquivo citado no catálogo, nos relatórios e na mídia existe no repositório.
3. Nenhum caminho do catálogo aponta para pasta privada (B0).
4. A pesquisa não contém colunas pessoais.
Sai com código 1 se algo falhar.
Uso: python scripts/validar_dados.py
"""
from __future__ import annotations

import re
import sys

from jsonschema import Draft7Validator

from comum import DADOS, RAIZ, eh_privado, ler_json

erros: list[str] = []


def checar_schema(nome: str) -> dict | None:
    dados = ler_json(DADOS / f"{nome}.json")
    schema = ler_json(RAIZ / "schemas" / f"{nome}.schema.json")
    if dados is None:
        erros.append(f"data/{nome}.json não existe")
        return None
    for e in Draft7Validator(schema).iter_errors(dados):
        caminho = "/".join(str(p) for p in e.absolute_path)
        erros.append(f"data/{nome}.json [{caminho}]: {e.message}")
    return dados


def checar_arquivo(caminho: str, origem: str) -> None:
    if not (RAIZ / caminho).exists():
        erros.append(f"{origem}: arquivo inexistente {caminho}")


def main() -> None:
    conteudo = checar_schema("conteudo")
    for nome in ("jornada", "pesquisa", "relatorios", "metricas", "explicacoes"):
        checar_schema(nome)
    if conteudo:
        for item in conteudo["itens"]:
            if eh_privado(item["arquivo"]):
                erros.append(f"conteudo: item privado no catálogo público {item['arquivo']}")
            for chave in ("arquivo", "mini", "grande", "capa"):
                if chave in item:
                    checar_arquivo(item[chave], f"conteudo/{item['id']}")
    relatorios = ler_json(DADOS / "relatorios.json", {"itens": []})
    for item in relatorios["itens"]:
        checar_arquivo(item["arquivo"], f"relatorios/{item['id']}")
    texto_pesquisa = (DADOS / "pesquisa.json").read_text(encoding="utf-8") if (DADOS / "pesquisa.json").exists() else ""
    if re.search(r"@|\b\d{10,11}\b", texto_pesquisa):
        erros.append("pesquisa.json parece conter e-mail ou telefone")
    if erros:
        print(f"{len(erros)} problema(s):")
        for e in erros:
            print(" -", e)
        sys.exit(1)
    print("dados válidos: schemas OK, arquivos existem, nada privado no catálogo")


if __name__ == "__main__":
    main()
