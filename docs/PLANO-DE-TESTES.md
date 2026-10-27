# Plano de testes — Hub v7

## 1. Rodar localmente
```bash
cd /c/veb/voltaexpressbrasil-hub
git checkout features/dashboard-inteligente-v1
python scripts/servir.py
```
Abra `http://localhost:8080`. Abrir o `index.html` direto pelo explorador (`file://`) não funciona: o navegador bloqueia a leitura dos JSON (o Hub mostra esse aviso).

## 2. Dados
```bash
pip install -r scripts/requirements.txt
python scripts/validar_dados.py        # deve terminar com "dados válidos: ..."
python scripts/gerar_tudo.py           # regenera tudo; depois: git diff --stat data/
```
Pronto quando: a validação passa e o `git diff` de `data/` só mostra o que você mudou.

## 3. Roteiro manual (≈15 min)
| # | Onde | Ação | Esperado |
|---|---|---|---|
| 1 | Visão geral | Ler os 4 números do topo | 3 projetos · 104 commits · 42 respostas · 165 materiais |
| 2 | Visão geral | Abrir "Como foi medido" | Método da medição aparece; LCP Home em vermelho (piorou), demais em verde |
| 3 | Relatórios | Abrir "Especificação — Match v2" | Texto completo, tabelas com rolagem própria no celular, data e fonte no topo |
| 4 | Relatórios | Voltar do navegador | Volta para a lista (rotas com `#`) |
| 5 | Pesquisa | Conferir "Tipo de caminhão" | Truck 10 (38%); "Ver dados em tabela" mostra os mesmos números |
| 6 | Pesquisa | Ler "Metodologia e limites" | Regras de anonimização e formulários excluídos |
| 7 | Demonstrações | Clicar no vídeo de lançamento | Abre a janela; o vídeo só começa a baixar ao apertar play (aba Rede). São 2 vídeos: o do mapa está oculto (D13) |
| 8 | Explicações | Gráfico de pesos | 35 / 20 / 15 / 15 / 10 / 5 pts |
| 9 | Jornada | Gráfico de commits | Barras por mês nas 3 cores; aviso sobre o commit do Lovable |
| 10 | Marca | Clicar num logotipo | Janela com "Baixar original" |
| 11 | Acervo | Buscar "logo", depois filtrar Formato = Vídeo | Contador muda; a URL guarda os filtros (copie e abra em outra aba) |
| 12 | Acervo | Marcar "Mostrar cópias idênticas" | Sem filtros, contador sobe de 165 para 188 (até você apagar as cópias da `remover-apos-v7.txt`) |
| 13 | Qualquer | Botão "Imprimir / PDF" | Sem cabeçalho, menu e filtros; gráficos coloridos |
| 14 | Qualquer | Tab a partir do topo | 1º foco: "Pular para o conteúdo"; foco sempre visível |
| 15 | Celular (DevTools, 360 px) | Percorrer as 8 seções | Sem rolagem lateral; menu de seções rola na horizontal; acervo em 2 colunas |

## 4. Depois de publicar (GitHub Pages)
| Teste | Pronto quando |
|---|---|
| PageSpeed Insights (celular) nas rotas Visão geral e Acervo | Desempenho ≥ 90, Acessibilidade ≥ 95; registrar em `data/metricas.json` |
| GitHub Actions "Validar dados do Hub" | Verde no PR |
| Links de "Baixar original" | Abrem o arquivo de `assets/` |

## 5. O que já foi testado em laboratório (27/10/2026)
Playwright + Chromium, servidor local com gzip, 10 telas × 5 larguras (320, 390, 768, 1024, 1440 px): 0 erros de JavaScript, 0 px de rolagem lateral, 0 falhas de contraste AA. Interações: busca, filtros, URL com filtros, "carregar mais" (48 → 96), abrir e fechar o visualizador (Esc), vídeo com `preload="none"` e capa, navegação pelo menu. Sem internet no laboratório: fontes e ícones simulados vazios e parte das miniaturas trocada por uma imagem fixa.
