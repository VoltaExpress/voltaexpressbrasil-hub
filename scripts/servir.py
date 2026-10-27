"""Servidor local do Hub, para testar antes de publicar.

Uso: python scripts/servir.py [porta]   (padrão 8080) → http://localhost:8080

Por que não só `python -m http.server`: no Windows, o Python lê os tipos de arquivo
do registro, e em algumas máquinas `.js` sai como `text/plain`. O navegador então
recusa os módulos do Hub ("MIME type text/plain") e a página fica vazia.
Aqui os tipos são fixados como no GitHub Pages.
"""
from __future__ import annotations

import functools
import http.server
import sys

from comum import RAIZ

TIPOS = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".webmanifest": "application/manifest+json",
    ".mp4": "video/mp4",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, **TIPOS}


def main() -> None:
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    servidor = http.server.ThreadingHTTPServer(("127.0.0.1", porta), functools.partial(Handler, directory=str(RAIZ)))
    print(f"Hub em http://localhost:{porta}  (Ctrl+C para parar)")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
