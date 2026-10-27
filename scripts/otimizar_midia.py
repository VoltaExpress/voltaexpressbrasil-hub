"""Gera versões leves das mídias públicas em midia/ (os originais em assets/ não são alterados).

- Imagens: WebP em 2 larguras — miniatura (480 px) e ampliada (1600 px), sem EXIF.
- Vídeos: capa em WebP (quadro de 3 s) e duração, para o player só baixar o vídeo ao clicar.
- Grava data/midia.json: original -> derivados, dimensões e bytes.

Incremental: só reprocessa o que mudou (compara o hash do original).
Requisitos: Pillow; ffmpeg/ffprobe no PATH para as capas de vídeo.
Uso: python scripts/otimizar_midia.py
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

from comum import ASSETS, DADOS, IMAGENS, MIDIA, VIDEOS, eh_privado, gravar_json, ler_json, rel, sha1, slug

LARGURAS = {"mini": 480, "grande": 1600}
QUALIDADE = 78


def destino(original: Path, sufixo: str, ext: str = ".webp") -> Path:
    pasta = original.parent.relative_to(ASSETS)
    partes = [slug(p) for p in pasta.parts]
    return MIDIA.joinpath(*partes, f"{slug(original.stem)}-{sufixo}{ext}")


def otimizar_imagem(original: Path) -> dict:
    with Image.open(original) as im:
        im = ImageOps.exif_transpose(im)
        transparente = "A" in im.getbands() or "transparency" in im.info
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if transparente else "RGB")
        largura, altura = im.size
        saida = {"largura": largura, "altura": altura, "bytes_original": original.stat().st_size}
        for nome, alvo in LARGURAS.items():
            w = min(alvo, largura)
            h = round(altura * w / largura)
            copia = im if w == largura else im.resize((w, h), Image.LANCZOS)
            arquivo = destino(original, nome)
            arquivo.parent.mkdir(parents=True, exist_ok=True)
            copia.save(arquivo, "WEBP", quality=QUALIDADE, method=6)
            saida[nome] = {"arquivo": rel(arquivo), "largura": w, "altura": h, "bytes": arquivo.stat().st_size}
        return saida


def otimizar_video(original: Path) -> dict:
    saida = {"bytes_original": original.stat().st_size}
    if not shutil.which("ffmpeg"):
        print("  aviso: ffmpeg não encontrado; capa do vídeo não gerada", file=sys.stderr)
        return saida
    sonda = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=width,height",
         "-of", "default=nw=1", str(original)], capture_output=True, text=True, check=False)
    for linha in sonda.stdout.splitlines():
        chave, _, valor = linha.partition("=")
        if chave == "duration":
            saida["duracao_s"] = round(float(valor))
        elif chave in ("width", "height") and valor.isdigit():
            saida["largura" if chave == "width" else "altura"] = int(valor)
    capa = destino(original, "capa")
    capa.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "3", "-i", str(original),
                    "-frames:v", "1", "-vf", "scale=720:-2", "-quality", "65", "-compression_level", "6", str(capa)], check=False)
    # 720 px (cartão de até ~370 px em tela 2x) e qualidade 65: com 1280/78 a capa do mapa passava de 370 KB.
    if capa.exists():
        saida["capa"] = {"arquivo": rel(capa), "bytes": capa.stat().st_size}
    return saida


def main() -> None:
    indice = ler_json(DADOS / "midia.json", {}) or {}
    vistos = set()
    novos = 0
    for original in sorted(ASSETS.rglob("*")):
        if not original.is_file():
            continue
        caminho = rel(original)
        ext = original.suffix.lower()
        if eh_privado(caminho) or ext not in IMAGENS | VIDEOS:
            continue
        vistos.add(caminho)
        impressao = sha1(original)
        anterior = indice.get(caminho)
        if anterior and anterior.get("sha1") == impressao and all(
            Path(MIDIA.parent / v["arquivo"]).exists() for k, v in anterior.items() if isinstance(v, dict) and "arquivo" in v
        ):
            continue
        try:
            info = otimizar_imagem(original) if ext in IMAGENS else otimizar_video(original)
        except Exception as erro:  # imagem corrompida não interrompe o lote
            print(f"  erro em {caminho}: {erro}", file=sys.stderr)
            continue
        info["sha1"] = impressao
        indice[caminho] = info
        novos += 1
        print(f"  ok {caminho}")
        if novos % 10 == 0:  # salva o progresso: uma interrupção não perde o lote
            gravar_json(DADOS / "midia.json", dict(sorted(indice.items())))
    for caminho in set(indice) - vistos:  # original removido ou tornado privado
        del indice[caminho]
    gravar_json(DADOS / "midia.json", dict(sorted(indice.items())))
    total_orig = sum(v.get("bytes_original", 0) for v in indice.values())
    total_web = sum(sum(d["bytes"] for k, d in v.items() if isinstance(d, dict) and "bytes" in d) for v in indice.values())
    print(f"{len(indice)} mídias ({novos} processadas agora) · originais {total_orig/1e6:.1f} MB → derivados {total_web/1e6:.1f} MB")


if __name__ == "__main__":
    main()
