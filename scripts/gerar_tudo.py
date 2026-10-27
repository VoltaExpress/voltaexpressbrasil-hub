"""Atualiza todo o Hub em ordem: mídia → catálogo → jornada → relatórios → pesquisa → validação.

Uso: python scripts/gerar_tudo.py [pasta_dos_formularios]
A pesquisa só é regenerada se a pasta dos formulários existir (ela fica no repositório privado).
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from comum import RAIZ

PASSOS = ["otimizar_midia.py", "gerar_catalogo.py", "gerar_jornada.py", "gerar_relatorios.py"]


def rodar(script: str, *args: str) -> None:
    print(f"\n▶ {script}")
    subprocess.run([sys.executable, str(RAIZ / "scripts" / script), *args], check=True, cwd=RAIZ)


def main() -> None:
    for passo in PASSOS:
        rodar(passo)
    pasta_forms = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "assets/arquivos/forms"
    if pasta_forms.exists():
        rodar("gerar_pesquisa.py", str(pasta_forms))
    else:
        print(f"\n▶ gerar_pesquisa.py ignorado: {pasta_forms} não existe (data/pesquisa.json mantido)")
    rodar("validar_dados.py")


if __name__ == "__main__":
    main()
