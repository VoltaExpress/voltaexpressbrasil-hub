# Relatório — Hub Volta Express Brasil

> Atualizado em 27/10/2026, versão 7.0 (branch `features/dashboard-inteligente-v1`). O Hub deixa de ser um navegador de arquivos e passa a ser uma central de evidências: relatórios, pesquisa, demonstrações, explicações, jornada e marca, com cada número ligado a uma fonte e uma data.

## 1. Objetivo
Reunir em um só lugar o material que explica, demonstra e comprova o trabalho da Volta Express: documentos dos projetos, o que o público respondeu na pesquisa, vídeos e fluxos do produto, regras do match, a história em commits e a identidade visual. Público: parceiros, mentores, investidores e o próprio time, inclusive em reunião (versão para imprimir em PDF).

## 2. Antes (v6, set/2026) e depois (v7)
| Indicador | v6 | v7 | Como foi medido |
|---|---|---|---|
| Scripts de terceiros na página | 6 (Tailwind CDN, Prism ×3, SheetJS, Mammoth) | 0 | `index.html` |
| Código próprio (HTML + CSS + JS) | 133,7 KB (25,1 KB gzip) | 74,5 KB (24,6 KB gzip) | `git show HEAD:<arquivo>` × arquivos novos, gzip nível 9 |
| Catálogo | 96 KB escritos à mão dentro do JS | `data/conteudo.json` gerado por script (13 KB gzip, baixado sob demanda) | `scripts/gerar_catalogo.py` |
| Números fixos no código | Sim, divergentes (32 × 38 diretórios) | Nenhum: KPIs calculados dos dados | revisão de `js/ui.js` |
| Validação dos dados | Nenhuma | 6 JSON Schemas + checagem de arquivos e de pasta privada, também no GitHub Actions | `scripts/validar_dados.py` |
| Peso das imagens exibidas | Originais (210 arquivos, 266,4 MB no total) | Derivados WebP e capas (16,6 MB no total; miniatura média 18 KB, versão grande 60 KB) | `data/midia.json` |
| Cópias idênticas no acervo | Não detectadas | 23 detectadas por SHA-1 e escondidas (21,4 MB) + 1 vídeo duplicado oculto (16,2 MB) | `docs/remover-apos-v7.txt` |
| Seções | 1 (árvore de arquivos) | 8 (Visão geral, Relatórios, Pesquisa, Demonstrações, Explicações, Jornada, Marca, Acervo) | — |
| Rolagem lateral (10 telas × 5 larguras, 320–1440 px) | não medido | 0 px | Playwright, `testar-hub.js` |
| Erros de JavaScript | aviso do Tailwind CDN no console | 0 | Playwright |
| Falhas de contraste (WCAG AA) | não medido | 0 nas 10 telas, em 390 e 1440 px | auditoria própria (luminância relativa) |

**Limites da medição.** O ambiente de teste não acessa a internet: a v6 não pôde ser medida (o Tailwind CDN é bloqueado e a página fica sem estilo), e na v7 as fontes e os ícones foram simulados vazios. O LCP medido na v7 (164 ms na Visão geral, 390 px) é de servidor local sem limitação de rede; serve para comparar versões futuras no mesmo ambiente, não como número de produção. As miniaturas que não foram copiadas para o teste foram trocadas por uma imagem de 9 KB.

## 3. Arquitetura
| Camada | Arquivos | Papel |
|---|---|---|
| Fontes | `assets/**`, `docs/*.md` dos 3 projetos, `git log` dos 3 repositórios, planilhas da pesquisa (repositório privado) | Material original |
| Curadoria | `data/curadoria.json` (regras por pasta e por arquivo), `data/marcos.json`, `data/metricas.json`, `data/explicacoes.json` | O que é editado à mão: títulos, finalidade, persona, marcos, métricas medidas e explicações, cada um com fonte |
| Geração | `scripts/*.py` (`gerar_tudo.py` roda tudo em ordem) | Gera `midia/`, `data/conteudo.json`, `jornada.json`, `pesquisa.json`, `relatorios.json` e `data/relatorios/*.html` |
| Contrato | `schemas/*.schema.json` + `scripts/validar_dados.py` + `.github/workflows/validar-dados.yml` | Impede publicar dado fora do formato, arquivo inexistente ou pasta privada |
| Apresentação | `index.html`, `shared/tokens.css`, `style.css`, `js/{config,data,renderers,ui,main}.js` | Sem build, módulos ES, rotas por `#`, gráficos em HTML/SVG com tabela de dados, `<dialog>` para ver o material, CSS de impressão |

## 4. Achados desta etapa
| # | Achado | Situação |
|---|---|---|
| A1 | Formulários com nome, e-mail e celular, pitch, ata e prints internos continuam versionados no repositório público (o `.gitignore` não remove arquivos já rastreados) | Fora do Hub. Remoção do repositório e do histórico: passo a passo em [B0-PROTECAO-DE-DADOS.md](B0-PROTECAO-DE-DADOS.md) |
| A2 | Credencial embutida na URL do remoto Git deste repositório e do da plataforma | Revogar e trocar a URL (B0, seção 0) |
| A3 | O vídeo "Demonstração do mapa de rotas" é uma gravação de tela real: mostra nome de pessoa, telefones e notificações de WhatsApp de terceiros | **Oculto do Hub** (D13); regravar com dados de teste (B0, seção 7) |
| A7 | 30 imagens da pasta `inspiracoes/` são peças de outras marcas (layouts, fotos, componentes) e 1 infográfico de terceiro em `qa-refs/` | **Ocultas do Hub** (D14, D15); continuam no disco como referência interna |
| A4 | 23 cópias idênticas e 1 vídeo duplicado (37,6 MB) | Escondidos do Hub; lista para remover em `docs/remover-apos-v7.txt` |
| A5 | O primeiro commit da plataforma (01/01/2025) é o modelo do Lovable com data fixa | A Jornada mostra o aviso; o trabalho real começa em fev/2026 |
| A6 | Pesquisa: oferta de carga concentrada em GO e caminhões saindo de MG rumo a SP; 63% dos embarcadores não informaram volume | Hipótese (amostra pequena e por conveniência, 42 respostas em set/2024), mostrada assim no Hub |

## 5. Notas estimadas (0–10)
| Indicador | v6 | v7 | Por quê |
|---|---|---|---|
| Performance | 4 | 8 | Sem scripts de terceiros; imagens em WebP com carregamento sob demanda; vídeo só baixa no play |
| Acessibilidade | 6 | 9 | Contraste AA, foco visível, "Pular para o conteúdo", gráficos com tabela, rótulos em todos os filtros |
| Boas práticas | 5 | 8 | Dados validados em CI, sem números fixos, sem HTML bruto vindo do Markdown |
| Governança de dados | 3 | 7 | Catálogo e pesquisa protegidos; falta tirar os arquivos internos do repositório (A1) e revogar a credencial (A2) |
| Valor para reunião | 3 | 8 | Resultados antes/depois, pesquisa, explicações e jornada com fonte; impressão em PDF |

## 6. Histórico
| Data | Entrega | Resultado |
|---|---|---|
| set/2026 | B0.1 — catálogo público limpo | 229 ativos públicos em 30 pastas; nenhum link para formulários, bases de respostas, documento mestre ou painéis administrativos |
| 27/10/2026 | v7 — central de evidências | 8 seções, 6 geradores, 6 schemas, 165 materiais únicos e próprios, 9 relatórios publicados, pesquisa agregada com 42 respostas |
