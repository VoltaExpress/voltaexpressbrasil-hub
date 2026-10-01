# Plano de Ação — Hub Volta Express Brasil

Legenda: ✅ feito · 🔄 em andamento · ⬜ a fazer. Cada fase só começa após autorização.

## B0 — Proteção de dados (prioridade máxima)
| ID | Status | Tarefa |
|---|---|---|
| B0.1 | ✅ | Levantar os documentos internos e com dados de terceiros; retirá-los do catálogo público e do README; `.gitignore` criado |
| B0.2 | 🔄 | Mover esses documentos para um repositório privado |
| B0.3 | 🔄 | Limpar o histórico do Git (`git filter-repo`) com acompanhamento, e depois forçar a atualização do remoto |

## B1 — Separar em dois produtos
| ID | Status | Tarefa |
|---|---|---|
| B1.1 | ⬜ | **Brand kit público** (GitHub Pages): logos, favicons, fotos de persona e peças de campanha otimizadas (WebP, reuso do script da landing) |
| B1.2 | ⬜ | **Hub privado** (Cloudflare Pages + Cloudflare Access, gratuito, login por e-mail): documentos, números e jornada |

## B2 — Dados versionados
| ID | Status | Tarefa |
|---|---|---|
| B2.1 | ⬜ | `data/metricas-mensais.json` (snapshot mensal) |
| B2.2 | ⬜ | `data/jornada.json` (marcos e versões) |
| B2.3 | ⬜ | `data/okrs.json` e `data/riscos.json` |
| B2.4 | ⬜ | `docs/DECISOES.md` (ADRs da startup) |
| B2.5 | ⬜ | Validação dos JSON no CI (schema) |

## B3 — Catálogo automático
| ID | Status | Tarefa |
|---|---|---|
| B3.1 | ⬜ | GitHub Action que gera o catálogo a partir das pastas, no lugar do `js/data.js` manual |
| B3.2 | ⬜ | Padronizar nomes em kebab-case e remover duplicados |

## B4 — Dashboard da diretoria
| Bloco | Indicadores |
|---|---|
| North Star | Fretes de retorno conectados por mês |
| Funil | Visitas → escolha de persona → clique WhatsApp/cadastro → cadastro → anúncio → match → frete fechado |
| Marketplace | Caminhoneiros e embarcadores ativos, cargas anunciadas, liquidez (% de cargas com match em até 24 h) |
| Receita | Assinantes, MRR, CAC por canal |
| Jornada | Linha do tempo de versões e marcos |
| Saúde | OKRs do trimestre, principais riscos, decisões pendentes |
Entrega com versão para imprimir em PDF, para reuniões.

## B5 — Integração
| ID | Status | Tarefa |
|---|---|---|
| B5.1 | ⬜ | Métricas da plataforma (tabela de matches e eventos) no snapshot mensal |
| B5.2 | ⬜ | Métricas da landing (analytics) no snapshot mensal |
| B5.3 | ⬜ | Ritual mensal: um PR atualiza `metricas-mensais.json` e gera o histórico do mês |

## B6 — Limpeza técnica
| ID | Status | Tarefa |
|---|---|---|
| B6.1 | ⬜ | Trocar o Tailwind CDN por CSS compilado |
| B6.2 | ⬜ | Remover `_redirects`; `noindex` no hub privado |
| B6.3 | ⬜ | README fiel ao que existe; links corrigidos |

## Registro de execução (set/2026)
- **B0.1 feito:** `js/data.js` sem as seções internas; `readme.md` sem o link do documento mestre e dos formulários; KPIs da tela inicial calculados a partir do catálogo (`js/ui.js`), não mais fixos.
- **B0.2 e B0.3 com você:** passo a passo completo em [B0-PROTECAO-DE-DADOS.md](B0-PROTECAO-DE-DADOS.md) (criar repositório privado, `git rm --cached`, `git filter-repo`).
