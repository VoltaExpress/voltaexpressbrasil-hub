# Plano de Ação — Hub Volta Express Brasil

Legenda: ✅ feito · 🔄 com você (manual) · ⬜ a fazer. Atualizado em 27/10/2026.

## B0 — Proteção de dados (prioridade máxima)
| ID | Status | Tarefa | Pronto quando |
|---|---|---|---|
| B0.0 | 🔄 | Revogar a credencial que está na URL do remoto Git (hub e plataforma) e trocar a URL | `git remote get-url origin` mostra só `https://github.com/VoltaExpress/<repo>.git` |
| B0.1 | ✅ | Catálogo público sem conteúdo interno; `.gitignore` | v7: validador falha se o catálogo citar pasta privada |
| B0.2 | 🔄 | Mover os documentos internos para o repositório privado `voltaexpressbrasil-interno` | `git ls-files` não lista nenhuma pasta da tabela do B0 |
| B0.3 | 🔄 | Limpar o histórico (`git filter-repo`) e forçar o push | Clone novo não contém os arquivos em nenhum commit |
| B0.4 | ✅ / 🔄 | Vídeo do mapa **oculto do Hub** (D13). Falta: regravar com dados de teste ou cortar, e só então reexibir; até lá, sai do repositório junto com o B0.2 | Vídeo novo sem nome, telefone nem notificação real |

## B1 — Central de evidências (v7)
| ID | Status | Tarefa |
|---|---|---|
| B1.1 | ✅ | 8 seções com rotas próprias e versão para imprimir |
| B1.2 | ✅ | Design system da landing v7 (`shared/tokens.css`) |
| B1.3 | ✅ | Visualizador com fonte, data e download; vídeo sob demanda |
| B1.4 | ⬜ | Hub privado (Cloudflare Pages + Access) para números internos: receita, CAC, OKRs, riscos |

## B2 — Dados versionados
| ID | Status | Tarefa |
|---|---|---|
| B2.1 | ✅ | `data/jornada.json` gerado do `git log` + `data/marcos.json` com fonte |
| B2.2 | ✅ | `data/metricas.json` (antes/depois com método e data) |
| B2.3 | ✅ | `docs/DECISOES.md` |
| B2.4 | ✅ | JSON Schema + `.github/workflows/validar-dados.yml` |
| B2.5 | ⬜ | `data/metricas-mensais.json` (snapshot mensal) e `data/okrs.json` — dependem do B1.4 |

## B3 — Catálogo automático
| ID | Status | Tarefa |
|---|---|---|
| B3.1 | ✅ | Catálogo gerado por `scripts/gerar_catalogo.py` (substitui o `js/data.js` manual) |
| B3.2 | ✅ | Duplicados detectados por SHA-1 |
| B3.3 | 🔄 | Remover do repositório os arquivos de `docs/remover-apos-v7.txt` |
| B3.4 | ⬜ | Padronizar nomes de `assets/` em kebab-case (hoje só os derivados em `midia/` seguem o padrão) |

## B4 — Dashboard da diretoria
| Bloco | Status | Observação |
|---|---|---|
| North Star (fretes de retorno conectados/mês) | ⬜ | Espaço reservado na Visão geral; virá de `vt_match_evento` quando a plataforma estiver em produção |
| Funil | ✅ (explicação) / ⬜ (números) | Etapas explicadas; números dependem de analytics na landing e eventos na plataforma |
| Pesquisa | ✅ | 42 respostas agregadas (set/2024) |
| Jornada | ✅ | Commits por mês e 11 marcos |

## B5 — Integração
| ID | Status | Tarefa |
|---|---|---|
| B5.1 | ⬜ | Métricas da plataforma no snapshot mensal |
| B5.2 | ⬜ | Analytics da landing no snapshot mensal |
| B5.3 | ⬜ | Ritual mensal: rodar `gerar_tudo.py`, revisar o diff dos JSON, abrir PR |
| B5.4 | ⬜ | Vídeos no YouTube: preencher `youtube` em `data/curadoria.json` e remover os `.mp4` do repositório |
| B5.5 | ⬜ | Nova rodada de pesquisa (a atual tem 42 respostas de set/2024) |

## B6 — Limpeza técnica
| ID | Status | Tarefa |
|---|---|---|
| B6.1 | ✅ | Tailwind CDN e demais scripts de terceiros removidos |
| B6.2 | 🔄 | Remover `public/_redirects` (lista em `remover-apos-v7.txt`) |
| B6.3 | ✅ | README fiel ao que existe |
| B6.4 | ⬜ | Hospedar Poppins e Boxicons no próprio repositório (hoje vêm do Google Fonts e do jsDelivr) |
| B6.5 | ⬜ | Medir a v7 publicada (PageSpeed Insights) e registrar em `data/metricas.json` |

## Registro de execução
- **set/2026 — B0.1:** catálogo e README sem conteúdo interno; `.gitignore`.
- **27/10/2026 — v7:** B1.1–B1.3, B2.1–B2.4, B3.1–B3.2, B6.1, B6.3. Detalhes em [RELATORIO.md](RELATORIO.md), decisões em [DECISOES.md](DECISOES.md), testes em [PLANO-DE-TESTES.md](PLANO-DE-TESTES.md).
