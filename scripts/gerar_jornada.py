"""Gera data/jornada.json a partir do histórico do Git dos 3 projetos + marcos curados.

Números verificáveis: qualquer pessoa pode conferir com `git log` em cada repositório.
Não exporta nomes nem e-mails de autores — só datas e contagens.
Marcos: data/marcos.json (curado à mão, cada marco com a fonte).
Uso: python scripts/gerar_jornada.py
"""
from __future__ import annotations

import collections
import datetime as dt
import subprocess

from comum import DADOS, RAIZ, VEB, gravar_json, ler_json

PROJETOS = {
    "landing": {"pasta": VEB / "voltaexpressbrasil", "nome": "Landing (voltaexpressbrasil)"},
    "plataforma": {"pasta": VEB / "voltaexpress", "nome": "Plataforma (voltaexpress)"},
    "hub": {"pasta": RAIZ, "nome": "Hub (voltaexpressbrasil-hub)"},
}


def datas_dos_commits(pasta) -> list[str]:
    if not (pasta / ".git").exists():
        return []
    saida = subprocess.run(["git", "log", "--all", "--no-merges", "--format=%cs"],
                           cwd=pasta, capture_output=True, text=True, check=False).stdout
    return sorted(data for data in saida.split() if data)


def main() -> None:
    projetos, meses_todos = {}, set()
    for chave, info in PROJETOS.items():
        datas = datas_dos_commits(info["pasta"])
        por_mes = collections.Counter(d[:7] for d in datas)
        meses_todos |= set(por_mes)
        projetos[chave] = {
            "nome": info["nome"],
            "commits": len(datas),
            "primeiro": datas[0] if datas else None,
            "ultimo": datas[-1] if datas else None,
            "por_mes": dict(sorted(por_mes.items())),
        }
    # Série contínua de meses (meses sem commit aparecem com 0, sem buracos no gráfico)
    serie = []
    if meses_todos:
        ano, mes = map(int, min(meses_todos).split("-"))
        fim = max(meses_todos)
        while f"{ano:04d}-{mes:02d}" <= fim:
            serie.append(f"{ano:04d}-{mes:02d}")
            ano, mes = (ano + 1, 1) if mes == 12 else (ano, mes + 1)
    marcos = ler_json(DADOS / "marcos.json", [])
    gravar_json(DADOS / "jornada.json", {
        "gerado_em": dt.date.today().isoformat(),
        "fonte": "git log --all --no-merges (data do commit) nos 3 repositórios",
        "meses": serie,
        "projetos": projetos,
        "total_commits": sum(p["commits"] for p in projetos.values()),
        "marcos": sorted(marcos, key=lambda m: m["data"]),
    })
    print({k: v["commits"] for k, v in projetos.items()}, "meses:", len(serie))


if __name__ == "__main__":
    main()
