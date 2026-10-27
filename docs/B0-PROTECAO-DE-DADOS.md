# B0 — Proteção de dados do Hub

> Atualizado em 27/10/2026 (v7). O Hub publicado já não mostra conteúdo interno: o catálogo é gerado por script, exclui as pastas abaixo (`PRIVADO` em `scripts/comum.py`) e o validador falha se alguma aparecer. **Mas os arquivos continuam no repositório público e no histórico do Git** — o `.gitignore` não tira arquivos que já estão rastreados. Os passos abaixo são feitos por você, nesta ordem.

## 0. Credencial na URL do remoto (fazer primeiro)
Os remotos de `voltaexpressbrasil-hub` e `voltaexpress` têm uma credencial embutida na URL (dentro de `.git/config`, que não vai para o GitHub, mas fica no disco em texto puro).
1. GitHub → Settings → Developer settings → Personal access tokens → **revogue** o token usado nessas URLs.
2. Troque a URL nos dois repositórios:
```bash
cd /c/veb/voltaexpressbrasil-hub && git remote set-url origin https://github.com/VoltaExpress/voltaexpressbrasil-hub.git
cd /c/veb/voltaexpress          && git remote set-url origin https://github.com/VoltaExpress/voltaexpress.git
```
3. No próximo `git push`, o Git Credential Manager pede login pelo navegador e guarda a credencial no cofre do Windows.

Pronto quando: `git remote get-url origin` mostra só `https://github.com/VoltaExpress/<repo>.git` e o token antigo aparece como revogado.

## 1. O que sai do repositório público
Arquivos rastreados hoje (`git ls-files`, 27/10/2026):

| Pasta | Arquivos | Por quê |
|---|---|---|
| `assets/arquivos/forms/` | 3 planilhas | Respostas de formulários com nome, e-mail e celular de terceiros (LGPD) |
| `assets/arquivos/parceiros/` | 1 ata | Reunião com parceiro (confidencial) |
| `assets/arquivos/pitch/` | 2 | Pitch e roteiro (estratégia) |
| `assets/arquivos/prototipo/` | 1 | Especificação de protótipo |
| `assets/arquivos/supabase/` | 4 prints | Configuração de infraestrutura |
| `assets/arquivos/vaga-dev/` | 1 | Desafio de contratação |
| `assets/voltaexpressbrasil/live/` | 1 print | Registro de reunião |
| `assets/voltaexpressbrasil/qa-infos/` | 22 prints | Telas da plataforma (podem conter dados de usuários) |
| `assets/voltaexpressbrasil/midias/videos/volta-express-mapa.mp4` | 1 vídeo | Gravação de tela com nome, telefones e notificações reais (seção 7) |
| `assets/arquivos/banco-dados/` | 0 (já fora) | Documentação interna da API |

As planilhas da pesquisa são a fonte de `data/pesquisa.json`. Depois de movidas, gere a pesquisa apontando para a pasta no repositório privado:
`python scripts/gerar_tudo.py ../voltaexpressbrasil-interno/forms`

## 2. Criar o repositório privado
1. GitHub → **New repository** → `voltaexpressbrasil-interno` → **Private**.
2. Copie as pastas da tabela para esse repositório (numa pasta separada, por exemplo `C:\veb\voltaexpressbrasil-interno`), faça commit e push.

## 3. Tirar as pastas do repositório público (sem apagar do disco)
```bash
cd /c/veb/voltaexpressbrasil-hub
git checkout -b seguranca/b0
git rm -r --cached assets/arquivos/forms assets/arquivos/parceiros assets/arquivos/pitch assets/arquivos/prototipo assets/arquivos/supabase assets/arquivos/vaga-dev assets/voltaexpressbrasil/live assets/voltaexpressbrasil/qa-infos assets/voltaexpressbrasil/midias/videos/volta-express-mapa.mp4
git status          # só "deleted" nessas pastas
git commit -m "seguranca(B0): retira documentos internos e dados de terceiros do repositório público"
git push -u origin seguranca/b0
python scripts/validar_dados.py   # continua válido: o catálogo não depende dessas pastas
```
Abra o PR e faça o merge.

Pronto quando: `git ls-files assets/arquivos/forms assets/voltaexpressbrasil/qa-infos` não lista nada.

## 4. Limpar o histórico
Faça **depois** do merge. Reescreve o histórico e exige `push --force`.
```bash
cd /c/veb
git clone --mirror https://github.com/VoltaExpress/voltaexpressbrasil-hub.git backup-hub.git
pip install git-filter-repo
git clone https://github.com/VoltaExpress/voltaexpressbrasil-hub.git hub-limpo
cd hub-limpo
git filter-repo --invert-paths --path assets/arquivos/forms --path assets/arquivos/parceiros --path assets/arquivos/pitch --path assets/arquivos/prototipo --path assets/arquivos/banco-dados --path assets/arquivos/supabase --path assets/arquivos/vaga-dev --path assets/voltaexpressbrasil/live --path assets/voltaexpressbrasil/qa-infos --path assets/voltaexpressbrasil/midias/videos/volta-express-mapa.mp4
git remote add origin https://github.com/VoltaExpress/voltaexpressbrasil-hub.git
git push --force --all
git push --force --tags
```
Depois:
- Clone de novo em `C:\veb` (o clone antigo ainda tem os arquivos no histórico).
- Forks e caches não são limpos pelo `filter-repo`; para o cache do GitHub, use o formulário "Remove sensitive data" do suporte.
- Guarde o `backup-hub.git` em local seguro e apague quando não precisar mais.

Pronto quando: `git log --all -- assets/arquivos/forms` não retorna nada no clone novo.

## 5. Dados pessoais já expostos
As respostas de formulário ficaram públicas por um período. Vale registrar internamente o ocorrido (o que, desde quando, quantas pessoas) e avaliar com orientação jurídica se cabe comunicar os titulares ou a ANPD (LGPD, art. 48).

## 6. Regra daqui em diante
- Repositório público: só marca, mídia de campanha, ativos já publicados e dados agregados.
- Arquivo com dado de pessoa (nome, e-mail, telefone, documento) ou informação comercial vai para o repositório privado.
- Antes de publicar, `python scripts/validar_dados.py` (o GitHub Actions roda de novo no PR).

## 7. Vídeo do mapa com dados reais
A revisão quadro a quadro (27/10/2026) mostrou que `assets/voltaexpressbrasil/midias/videos/volta-express-mapa.mp4` é uma gravação de tela real: aparecem nome de pessoa, números de telefone e notificações de WhatsApp de terceiros.
- **Feito:** oculto do Hub (`"publico": false` em `data/curadoria.json`, decisão D13) e incluído no `.gitignore`.
- **Com você:** o arquivo continua rastreado no repositório público; os comandos dos passos 3 e 4 acima já o incluem.
- **Para reexibir:** regrave a demonstração com dados de teste (nome fictício, número de teste 5532988367667) e sem notificações, salve com outro nome, ajuste a curadoria e rode `python scripts/gerar_tudo.py`.
- Os outros 2 vídeos foram revisados: animação de lançamento e tutorial da v4.2, sem dados pessoais visíveis. Ambos têm marca d'água de ferramenta gratuita (Animaker, VEED) — vale regravar sem ela quando subir ao YouTube.
