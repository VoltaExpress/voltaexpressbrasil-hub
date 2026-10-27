"""Gera data/pesquisa.json — resultados AGREGADOS e ANONIMIZADOS dos formulários de interesse.

Privacidade (LGPD):
- As planilhas originais têm nome, e-mail e celular. Elas ficam no repositório PRIVADO e nunca
  são publicadas; este script roda localmente e só grava contagens.
- Colunas pessoais, de texto livre e de horário são ignoradas (lista COLUNAS_IGNORADAS).
- Localização só no nível de estado (UF), nunca cidade ou endereço.
- Categorias com menos de K_MINIMO respostas são agrupadas em "Outros".
- Formulários com menos de 10 respostas não entram (amostra pequena demais para não identificar).

Uso: python scripts/gerar_pesquisa.py [pasta_dos_formularios]
     (padrão: assets/arquivos/forms; depois do B0, aponte para a cópia no repositório privado)
"""
from __future__ import annotations

import collections
import datetime as dt
import re
import sys
from pathlib import Path

from openpyxl import load_workbook

from comum import DADOS, RAIZ, gravar_json

K_MINIMO = 3
RESPOSTAS_MINIMAS = 10
COLUNAS_IGNORADAS = re.compile(r"e-?mail|nome|celular|telefone|whats|^id$|hora|observa|nascimento", re.I)

CAPITAIS = {"são paulo": "SP", "rio de janeiro": "RJ", "belo horizonte": "MG", "curitiba": "PR", "goiânia": "GO",
            "brasília": "DF", "salvador": "BA", "recife": "PE", "fortaleza": "CE", "porto alegre": "RS",
            "florianópolis": "SC", "vitória": "ES", "campinas": "SP", "manaus": "AM", "belém": "PA"}
UFS = set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split())

FORMULARIOS = [
    {
        "id": "embarcadores",
        "padrao": "Anuncie sua carga*",
        "titulo": "Embarcadores",
        "descricao": "Formulário \"Anuncie sua carga com o Volta Express\": quem tem carga para transportar.",
        "perguntas": [
            {"id": "mercadoria", "titulo": "Tipo de mercadoria", "coluna": "Qual o tipo de mercadoria", "tipo": "categoria"},
            {"id": "volume", "titulo": "Informou o volume da carga?", "coluna": "Qual o volume da Mercadoria?", "tipo": "informado"},
            {"id": "uf_origem", "titulo": "Estado de coleta", "coluna": "Endereço para coleta", "tipo": "uf"},
            {"id": "uf_destino", "titulo": "Estado de entrega", "coluna": "Endereço para descarga", "tipo": "uf"},
        ],
        "coluna_data": "Carregar em",
    },
    {
        "id": "caminhoneiros",
        "padrao": "Complete sua viagem*",
        "titulo": "Caminhoneiros",
        "descricao": "Formulário \"Complete sua viagem com o Volta Express\": quem tem caminhão com espaço livre.",
        "perguntas": [
            {"id": "tipo_caminhao", "titulo": "Tipo de caminhão", "coluna": "Tipo de Caminhão", "tipo": "caminhao"},
            {"id": "capacidade", "titulo": "Capacidade disponível", "coluna": "Qual a capacidade máxima", "tipo": "capacidade"},
            {"id": "uf_origem", "titulo": "Estado de início da rota", "coluna": "Endereço de inicio da rota", "tipo": "uf"},
            {"id": "uf_destino", "titulo": "Estado de fim da rota", "coluna": "Endereço final da rota", "tipo": "uf"},
        ],
        "coluna_data": "Carregar em",
    },
]


def achar_coluna(cabecalho: list[str], inicio: str) -> int | None:
    alvo = inicio.strip().lower()
    for i, nome in enumerate(cabecalho):
        if nome.strip().lower().startswith(alvo) and not nome.strip().endswith("2"):
            return i
    return None


def para_uf(texto: str) -> str:
    texto = str(texto).strip()
    m = re.search(r"(?:[-,/]\s*|\s)([A-Za-z]{2})\.?\s*$", texto)
    if m and m.group(1).upper() in UFS:
        return m.group(1).upper()
    return CAPITAIS.get(texto.lower(), "Não identificado")


def capacidade(texto: str) -> str:
    numeros = [float(n.replace(",", ".")) for n in re.findall(r"\d+(?:[.,]\d+)?", str(texto))]
    if not numeros:
        return "Não informado"
    t = max(numeros)
    if t > 1000:  # respondeu em kg
        t /= 1000
    if t <= 5:
        return "Até 5 t"
    if t <= 14:
        return "5 a 14 t"
    if t <= 30:
        return "15 a 30 t"
    return "Mais de 30 t"


def caminhao(texto: str) -> str:
    t = str(texto).strip()
    t = re.sub(r"^caminh[aã]o\s+", "", t, flags=re.I)
    return t[:1].upper() + t[1:]


def normalizar(tipo: str, valor) -> str:
    if valor in (None, ""):
        return "Não informado"
    if tipo == "uf":
        return para_uf(valor)
    if tipo == "capacidade":
        return capacidade(valor)
    if tipo == "caminhao":
        return caminhao(valor)
    if tipo == "informado":
        return "Informou" if re.search(r"\d", str(valor)) else "Não informou"
    texto = str(valor).strip()
    return texto[:1].upper() + texto[1:].lower()


def agrupar(contagem: collections.Counter) -> list[dict]:
    """Supressão: categorias com menos de K_MINIMO respostas viram 'Outros'."""
    dados, outros = [], 0
    for rotulo, valor in contagem.most_common():
        if valor < K_MINIMO and rotulo not in ("Não informado", "Não identificado"):
            outros += valor
        else:
            dados.append({"rotulo": rotulo, "valor": valor})
    if outros:
        dados.append({"rotulo": f"Outros (grupos com menos de {K_MINIMO})", "valor": outros})
    return dados


def main() -> None:
    pasta = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "assets/arquivos/forms"
    grupos, excluidos, datas = [], [], []
    usados = set()
    for form in FORMULARIOS:
        arquivos = sorted(pasta.glob(form["padrao"] + ".xlsx"))
        if not arquivos:
            print(f"aviso: formulário {form['padrao']} não encontrado em {pasta}")
            continue
        usados.add(arquivos[0].name)
        linhas = list(load_workbook(arquivos[0], data_only=True).worksheets[0].iter_rows(values_only=True))
        cabecalho = [str(c or "") for c in linhas[0]]
        respostas = [r for r in linhas[1:] if any(v not in (None, "") for v in r)]
        perguntas = []
        for p in form["perguntas"]:
            i = achar_coluna(cabecalho, p["coluna"])
            assert i is not None and not COLUNAS_IGNORADAS.search(cabecalho[i]), p["coluna"]
            contagem = collections.Counter(normalizar(p["tipo"], r[i]) for r in respostas)
            perguntas.append({"id": p["id"], "titulo": p["titulo"], "dados": agrupar(contagem)})
        i_data = achar_coluna(cabecalho, form["coluna_data"])
        if i_data is not None:
            datas += [r[i_data] for r in respostas if isinstance(r[i_data], dt.datetime)]
        grupos.append({"id": form["id"], "titulo": form["titulo"], "descricao": form["descricao"],
                       "respostas": len(respostas), "perguntas": perguntas})
    for arquivo in sorted(pasta.glob("*.xlsx")):
        if arquivo.name in usados:
            continue
        linhas = list(load_workbook(arquivo, data_only=True).worksheets[0].iter_rows(values_only=True))
        n = max(len(linhas) - 1, 0)
        excluidos.append({"formulario": re.sub(r"\s*\(.*\)$", "", arquivo.stem),
                          "respostas": n, "motivo": f"menos de {RESPOSTAS_MINIMAS} respostas"})
    periodo = None
    if datas:
        periodo = {"de": min(datas).date().isoformat(), "ate": max(datas).date().isoformat(),
                   "observacao": "datas de coleta informadas pelos respondentes"}
    gravar_json(DADOS / "pesquisa.json", {
        "gerado_em": dt.date.today().isoformat(),
        "metodologia": {
            "fonte": "Formulários Microsoft Forms de interesse no Volta Express (exportação .xlsx)",
            "periodo": periodo,
            "anonimizacao": [
                "Nome, e-mail, celular, empresa, horários e textos livres não são lidos para o resultado.",
                "Localização só por estado (UF).",
                f"Categorias com menos de {K_MINIMO} respostas agrupadas em \"Outros\".",
                f"Formulários com menos de {RESPOSTAS_MINIMAS} respostas excluídos.",
            ],
            "limitacoes": "Amostra pequena e de conveniência (quem respondeu ao formulário); não representa o mercado.",
            "excluidos": excluidos,
        },
        "grupos": grupos,
    })
    print({g["id"]: g["respostas"] for g in grupos}, "excluídos:", [e["respostas"] for e in excluidos])


if __name__ == "__main__":
    main()
