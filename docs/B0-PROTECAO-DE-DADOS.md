# B0 — Proteção de dados do Hub

> Executado em set/2026. O catálogo público (`js/data.js`) e o README já não apontam para conteúdo interno.
> Falta tirar os arquivos do repositório público e do histórico do Git — passos abaixo, feitos por você.

## 1. O que sai do repositório público
| Pasta | Por quê |
|---|---|
| `assets/arquivos/forms/` | Respostas de formulários com nome, e-mail e celular de terceiros (LGPD) |
| `assets/arquivos/parceiros/` | Ata de reunião com parceiro (confidencial) |
| `assets/arquivos/pitch/` | Pitch e roteiro (estratégia) |
| `assets/arquivos/prototipo/` | Especificação de protótipo |
| `assets/arquivos/banco-dados/` | Documentação interna da API |
| `assets/arquivos/supabase/` | Prints de configuração de infraestrutura |
| `assets/arquivos/vaga-dev/` | Desafio de contratação |
| `assets/voltaexpressbrasil/live/` | Registro de reunião |
| `assets/voltaexpressbrasil/qa-infos/` | Prints da plataforma (podem conter dados de usuários) |

Também saíram do catálogo: atalhos para formulários e bases de respostas (Microsoft Forms/OneDrive), benchmarking com o documento mestre de requisitos, e painéis Netlify/GoDaddy.

O `.gitignore` já lista essas pastas: depois do passo 3 elas continuam no seu disco, mas o Git passa a ignorá-las.

## 2. Criar o repositório privado
1. GitHub → **New repository** → `voltaexpressbrasil-interno` → **Private**.
2. Copie as pastas da tabela para esse repositório (numa pasta separada do seu computador), faça commit e push.

## 3. Tirar as pastas do repositório público (sem apagar do disco)
```bash
cd /c/ambiente-projeto/veb/voltaexpressbrasil-hub
git checkout -b seguranca/b0
git rm -r --cached assets/arquivos/forms assets/arquivos/parceiros assets/arquivos/pitch assets/arquivos/prototipo assets/arquivos/banco-dados assets/arquivos/supabase assets/arquivos/vaga-dev assets/voltaexpressbrasil/live assets/voltaexpressbrasil/qa-infos
git add .gitignore js/data.js js/ui.js index.html readme.md docs
git status
git commit -m "seguranca(B0): retira documentos internos e dados de terceiros do repositório público"
git push -u origin seguranca/b0
```
Abra o PR e faça o merge. A partir daí, a versão publicada não tem mais esses arquivos.

## 4. Limpar o histórico (os arquivos continuam nos commits antigos)
Faça **depois** do merge. Reescreve o histórico e exige `push --force`.

```bash
cd /c/ambiente-projeto/veb
git clone --mirror https://github.com/VoltaExpress/voltaexpressbrasil-digital.git backup-hub.git
pip install git-filter-repo
git clone https://github.com/VoltaExpress/voltaexpressbrasil-digital.git hub-limpo
cd hub-limpo
git filter-repo --invert-paths --path assets/arquivos/forms --path assets/arquivos/parceiros --path assets/arquivos/pitch --path assets/arquivos/prototipo --path assets/arquivos/banco-dados --path assets/arquivos/supabase --path assets/arquivos/vaga-dev --path assets/voltaexpressbrasil/live --path assets/voltaexpressbrasil/qa-infos
git remote add origin https://github.com/VoltaExpress/voltaexpressbrasil-digital.git
git push --force --all
git push --force --tags
```

Depois:
- Quem tiver clone antigo precisa clonar de novo (o antigo ainda tem os arquivos).
- Forks e caches externos não são limpos pelo `filter-repo`; para páginas em cache do GitHub, use o formulário de suporte "Remove sensitive data".
- Guarde o `backup-hub.git` em local seguro e apague quando não precisar mais.

## 5. Dados pessoais já expostos
As respostas de formulário ficaram públicas por um período. Vale registrar internamente o ocorrido (o que, desde quando, quantas pessoas) e avaliar com orientação jurídica se cabe comunicar os titulares ou a ANPD (LGPD, art. 48).

## 6. Regra daqui em diante
- Repositório público: só marca, mídia de campanha e ativos já publicados.
- Qualquer arquivo com dado de pessoa (nome, e-mail, telefone, documento) ou informação comercial vai para o repositório privado.
