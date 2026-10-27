"""Configuração e funções comuns aos scripts do Hub.

Todos os scripts rodam a partir da raiz do repositório:
    python scripts/<nome>.py
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

# Terminal do Windows (Git Bash, PowerShell): força UTF-8 nos acentos e imprime na hora,
# sem esperar o buffer encher (senão "Hub em http://..." só aparece depois).
for _fluxo in (sys.stdout, sys.stderr):
    try:
        _fluxo.reconfigure(encoding="utf-8", line_buffering=True)
    except (AttributeError, ValueError):
        pass

RAIZ = Path(__file__).resolve().parent.parent
ASSETS = RAIZ / "assets"
MIDIA = RAIZ / "midia"          # derivados leves (WebP, capas de vídeo) gerados por otimizar_midia.py
DADOS = RAIZ / "data"
VEB = RAIZ.parent                # pasta que contém os 3 projetos (C:\veb)

# Conteúdo interno (B0): nunca entra no catálogo público nem é otimizado para publicação.
PRIVADO = [
    "assets/arquivos/banco-dados",
    "assets/arquivos/forms",
    "assets/arquivos/parceiros",
    "assets/arquivos/pitch",
    "assets/arquivos/prototipo",
    "assets/arquivos/supabase",
    "assets/arquivos/vaga-dev",
    "assets/voltaexpressbrasil/live",
    "assets/voltaexpressbrasil/qa-infos",
]

IMAGENS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
VIDEOS = {".mp4", ".webm", ".mov"}
CODIGO = {".js", ".css", ".json", ".html"}


def rel(caminho: Path) -> str:
    """Caminho relativo à raiz, sempre com barras '/' (igual no Windows e no Linux)."""
    return caminho.resolve().relative_to(RAIZ).as_posix()


def eh_privado(caminho_relativo: str) -> bool:
    return any(caminho_relativo == p or caminho_relativo.startswith(p + "/") for p in PRIVADO)


def slug(texto: str) -> str:
    """kebab-case sem acentos: 'Car Website – 1@2x' -> 'car-website-1-2x'."""
    sem_acento = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", sem_acento.lower()).strip("-") or "arquivo"


def sha1(caminho: Path, bloco: int = 1 << 20) -> str:
    """Impressão digital do conteúdo: arquivos iguais têm o mesmo hash (detecta duplicados)."""
    h = hashlib.sha1()
    with caminho.open("rb") as f:
        while parte := f.read(bloco):
            h.update(parte)
    return h.hexdigest()


def ler_json(caminho: Path, padrao=None):
    if not caminho.exists():
        return padrao
    return json.loads(caminho.read_text(encoding="utf-8"))


def gravar_json(caminho: Path, dados) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    texto = json.dumps(dados, ensure_ascii=False, indent=2) + "\n"
    caminho.write_text(texto, encoding="utf-8", newline="\n")
