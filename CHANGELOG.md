# Changelog — Hub Volta Express Brasil

## [7.0.0] — 27/10/2026 · branch `features/dashboard-inteligente-v1`
O Hub passa de navegador de arquivos a central de evidências.

### Adicionado
- 8 seções com link próprio: Visão geral, Relatórios, Pesquisa, Demonstrações, Explicações, Jornada, Marca e Acervo.
- `scripts/`: geradores de mídia (WebP e capas de vídeo), catálogo, jornada (`git log`), pesquisa agregada, relatórios (Markdown → HTML) e validação; `gerar_tudo.py` roda todos.
- `schemas/`: 6 JSON Schemas (draft-07) para os arquivos de `data/`.
- `.github/workflows/validar-dados.yml`: validação dos dados em todo push e PR.
- `scripts/servir.py`: servidor local com tipos de arquivo corretos (no Windows, `python -m http.server` pode servir `.js` como texto).
- `data/curadoria.json`, `marcos.json`, `metricas.json`, `explicacoes.json`: conteúdo editável, sempre com fonte.
- `midia/`: derivados leves de 210 arquivos (16,6 MB) a partir de 266,4 MB de originais.
- Gráficos de barras (HTML) e colunas empilhadas (SVG), sempre com a tabela de dados.
- Visualizador em `<dialog>` com data, fonte, tamanho e download do original; vídeo com `preload="none"`.
- Versão para imprimir/PDF em todas as seções.
- Docs: `DECISOES.md`, `PLANO-DE-TESTES.md`, `remover-apos-v7.txt`, este changelog.

### Alterado
- `index.html`, `style.css`, `js/*`: reescritos sobre o design system da landing v7 (`shared/tokens.css`).
- `js/data.js`: de catálogo escrito à mão (96 KB) para carregador dos JSON gerados.
- `readme.md`, `docs/RELATORIO.md`, `docs/PLANO-DE-ACAO.md`, `docs/B0-PROTECAO-DE-DADOS.md`: atualizados para a v7.

### Removido
- Do Hub público (ocultos pela curadoria, arquivos continuam no disco): vídeo do mapa com dados reais de pessoas (D13), 30 referências visuais de terceiros (D14) e o infográfico de terceiro de tamanhos de caminhão (D15).
- Tailwind CDN, Prism, SheetJS e Mammoth (6 scripts de terceiros).
- Visualizadores de PDF, XLSX e DOCX (esses arquivos eram internos; ver D10).
- Cópias idênticas do acervo (escondidas; os arquivos continuam no disco até a remoção manual).

## [6.x] — até set/2026
- Navegador em árvore com busca e visualizadores; B0.1 (catálogo sem conteúdo interno, `.gitignore`).
