# Status e caminho até o MVP — Hub Volta Express Brasil

> Atualizado em 06/11/2026. Fonte: `docs/PLANO-DE-ACAO.md`, `docs/B0-PROTECAO-DE-DADOS.md`, `docs/DECISOES.md`, `CHANGELOG.md` e o estado do repositório.
> **MVP** aqui é: um Hub público sem nenhum dado interno no repositório nem no histórico, com o acervo histórico curado e pelo menos a North Star alimentada por dados reais da plataforma.

## Onde estamos
| Item | Situação |
|---|---|
| Código | v7.0 em `main` (commit `dc77a35`, 28/10/2026) |
| GitHub | Repositório público `VoltaExpress/voltaexpressbrasil-hub`; workflow "Validar dados do Hub" passando em `main` |
| Hospedagem | GitHub Pages em `voltaexpress.github.io/voltaexpressbrasil-hub/`, com HTTPS; último deploy com sucesso em 28/10/2026 |
| Documentação | `docs/`: relatório, plano de ação, decisões (D1–D18), plano de testes, B0 e lista de remoção |

## O que já foi feito
- **v7.0 (27/10/2026):** 8 seções com link próprio (Visão geral, Relatórios, Pesquisa, Demonstrações, Explicações, Jornada, Marca e Acervo), versão para impressão e visualizador com fonte, data e download.
- **Dados versionados:** catálogo, jornada, relatórios e pesquisa gerados por script (`scripts/gerar_tudo.py`) e validados por JSON Schema em todo push e PR.
- **Proteção no catálogo (B0.1):** pastas internas fora do catálogo publicado; vídeo do mapa e referências de terceiros ocultos (D13–D15).
- **Conteúdo recente:** canais oficiais e o marco "Plataforma v3: pronta para demonstração".

## O que falta para o MVP
| # | Tarefa | Origem | Pronto quando |
|---|---|---|---|
| 1 | Revogar a credencial da URL do remoto e trocar a URL | B0.0 | `git remote get-url origin` sem token |
| 2 | Criar o repositório privado `voltaexpressbrasil-interno` e mover as pastas internas da tabela do B0 (formulários, parceiros, pitch, protótipo, supabase, vaga, live, qa-infos e o vídeo do mapa) | B0.2 | `git ls-files` não lista nenhuma pasta do B0 |
| 3 | Limpar o histórico com `git filter-repo` e forçar o push | B0.3 | Clone novo sem esses arquivos em nenhum commit |
| 4 | Tirar `scripts/__pycache__` do Git e remover os arquivos de `docs/remover-apos-v7.txt` (inclui `public/_redirects`) | V10, B3.3, B6.2 | `git ls-files scripts/__pycache__` vazio |
| 5 | Incluir o acervo histórico curado (Ferrex 2023, v3/v4 e landing v5) com cortes e borrões feitos antes de entrar em `assets/` | Curadoria de 06/11/2026 | Novas coleções no Acervo e novos marcos na Jornada, validador passando |
| 6 | Publicar os relatórios aprovados da plataforma: `MATCH-PONTUACAO-V3.md`, `REFERENCIAS.md` e `DESIGN.md` | Curadoria de 06/11/2026 | Novas entradas em `scripts/gerar_relatorios.py` e em `#/relatorios` |
| 7 | North Star e funil com números reais da plataforma (`vt_match_evento`) | B4, B5.1 | Visão geral com fretes de retorno conectados por mês |
| 8 | Medir a v7 publicada no PageSpeed e registrar em `data/metricas.json` | B6.5 | Métrica com método e data |

**Depois do MVP:** Hub privado para números internos (B1.4), snapshot mensal e OKRs (B2.5), analytics da landing (B5.2), ritual mensal de atualização (B5.3), vídeos no YouTube (B5.4), nova rodada de pesquisa (B5.5), nomes de `assets/` em kebab-case (B3.4), fontes e ícones no próprio repositório (B6.4).

## Issues para criar (manualmente)
| # | Título | Rótulo |
|---|---|---|
| 1 | B0.0: remover credencial da URL do remoto e revogar o token | `bug` |
| 2 | B0.2: mover documentos internos para o repositório privado | `bug` |
| 3 | B0.3: limpar o histórico com `git filter-repo` | `bug` |
| 4 | Limpeza: `__pycache__` e lista `remover-apos-v7.txt` | `enhancement` |
| 5 | Acervo: incluir histórico curado (Ferrex 2023, v3/v4, landing v5) | `enhancement` |
| 6 | Relatórios: publicar match v3, referências e design da plataforma | `documentation` |
| 7 | Dashboard: North Star e funil com dados reais da plataforma | `enhancement` |
| 8 | Métricas: PageSpeed da v7 em `data/metricas.json` | `documentation` |
