# Hub Volta Express Brasil

Central de evidências da Volta Express: relatórios, pesquisa, demonstrações, explicações, jornada e marca. Cada número mostrado tem fonte e data, e cada material serve para explicar, demonstrar ou comprovar algo.

**Versão 7.0** · site estático, sem build · GitHub Pages · dados gerados por script e validados por JSON Schema.

## Seções
| Rota | O que mostra | De onde vem |
|---|---|---|
| `#/` Visão geral | Números do ecossistema, North Star, resultados antes/depois, marcos recentes | `data/jornada.json`, `pesquisa.json`, `conteudo.json`, `metricas.json` |
| `#/relatorios` | Relatórios, decisões e especificações dos 3 projetos | `docs/*.md` de cada repositório → `data/relatorios/*.html` |
| `#/pesquisa` | Respostas de embarcadores e caminhoneiros, em agregado anônimo | Planilhas dos formulários (repositório privado) → `data/pesquisa.json` |
| `#/demonstracoes` | Vídeos, fluxos de tela e código dos protótipos | `assets/` → `data/conteudo.json` |
| `#/explicacoes` | Como o match funciona, tipos de caminhão, funil, glossário | `data/explicacoes.json` |
| `#/jornada` | Commits por mês e marcos | `git log` dos 3 repositórios + `data/marcos.json` |
| `#/marca` | Cores, tipografia, logotipos, campanhas, canais oficiais | `shared/tokens.css`, `data/conteudo.json` |
| `#/acervo` | Todos os materiais públicos, com busca e filtros (os filtros ficam na URL) | `data/conteudo.json` |

## Estrutura
```text
voltaexpressbrasil-hub/
├── index.html              # casca: cabeçalho, menu, <main id="app">, visualizador <dialog>
├── style.css               # estilos do Hub (inclui impressão/PDF)
├── shared/tokens.css       # design system da landing v7 (cores, fonte, espaçamentos)
├── js/
│   ├── config.js           # rótulos, cores por projeto, paleta
│   ├── data.js             # carrega data/*.json (com cache)
│   ├── renderers.js        # cartões, KPIs, gráficos, tabelas, visualizador
│   ├── ui.js               # as 8 seções
│   └── main.js             # roteador por # e eventos globais
├── data/                   # JSON: editados à mão (curadoria, marcos, métricas, explicações) e gerados
├── schemas/                # JSON Schema (draft-07) de cada arquivo gerado
├── scripts/                # geradores e validador (Python)
├── midia/                  # versões leves (WebP, capas de vídeo) geradas dos originais
├── assets/                 # originais (download pelo Hub)
├── public/                 # favicons e manifest
├── docs/                   # relatório, plano de ação, decisões, testes, B0
└── .github/workflows/      # validação dos dados em push e PR
```

## Rodar localmente
```bash
python scripts/servir.py        # abra http://localhost:8080 (tipos de arquivo corretos também no Windows)
```
Abrir o `index.html` direto (`file://`) não funciona: o navegador bloqueia a leitura dos JSON.

## Atualizar os dados
```bash
pip install -r scripts/requirements.txt     # Python 3.10+; ffmpeg à parte para capas de vídeo
python scripts/gerar_tudo.py                # mídia → catálogo → jornada → relatórios → pesquisa → validação
git diff --stat data/ midia/                # revise o que mudou antes do commit
```
| Quero… | Edite | Depois rode |
|---|---|---|
| Mudar título, resumo, finalidade ou persona de um material, ou ocultá-lo | `data/curadoria.json` (`"publico": false` oculta) | `gerar_catalogo.py` |
| Regras para uma pasta inteira (inclusive ocultar) | `data/curadoria.json`, bloco `pastas` | `gerar_catalogo.py` |
| Adicionar imagem ou vídeo | coloque em `assets/` | `gerar_tudo.py` |
| Novo marco na jornada | `data/marcos.json` (com fonte) | `gerar_jornada.py` |
| Novo resultado antes/depois | `data/metricas.json` (com método e data) | `validar_dados.py` |
| Atualizar um relatório | o `.md` no repositório de origem | `gerar_relatorios.py` |

Os geradores leem os repositórios vizinhos em `C:\veb` (`voltaexpressbrasil`, `voltaexpress`), por isso rodam na sua máquina; o GitHub Actions só valida.

## Regras de dados
- Público só o que pode ser publicado: as pastas internas (lista em `scripts/comum.py` e no `.gitignore`) nunca entram no catálogo — o validador falha se entrarem.
- Pesquisa só em agregado: grupos com menos de 3 respostas viram "Outros", formulários com menos de 10 respostas ficam de fora, local só por UF, nenhum dado pessoal.
- Todo número tem fonte e data. Detalhes em [docs/DECISOES.md](docs/DECISOES.md).

## Documentação
- [Relatório (antes/depois da v7)](docs/RELATORIO.md)
- [Plano de ação](docs/PLANO-DE-ACAO.md)
- [Decisões](docs/DECISOES.md)
- [Plano de testes](docs/PLANO-DE-TESTES.md)
- [B0 — proteção de dados](docs/B0-PROTECAO-DE-DADOS.md)
- [Arquivos para remover](docs/remover-apos-v7.txt)
- [Changelog](CHANGELOG.md)

## Projetos relacionados
- Landing: [voltaexpressbrasil](https://github.com/VoltaExpress/voltaexpressbrasil)
- Plataforma: [voltaexpress.com.br](https://voltaexpress.com.br/)
