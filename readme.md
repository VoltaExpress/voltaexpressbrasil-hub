# 🚚 Volta Express Brasil — Brand, Media e Digital Assets Hub

<p align="center">
  <img src="https://img.shields.io/badge/Version-v6.0_Digital-0052CC?style=for-the-badge&logo=github" alt="Version 6.0">
  <img src="https://img.shields.io/badge/Architecture-ES6_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="ES6 Modules">
  <img src="https://img.shields.io/badge/UI_Framework-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/BU-Log%C3%ADstica_&_Transporte-FF6C37?style=for-the-badge&logo=postman" alt="BU Logística">
  <img src="https://img.shields.io/badge/Status-Production_Ready-2ea44f?style=for-the-badge" alt="Status">
</p>

> **Single Source of Truth (SSOT)** para ativos de mídia, design system, mídias de campanhas, provas sociais de personas e documentação técnica e de produto do ecossistema **Volta Express Brasil**.

---

## 💡 Sobre o Hub Digital

Este repositório atua como o **Portal do Conhecimento e Central de Ativos** da plataforma **Volta Express Brasil**. 

Além de armazenar e organizar todos os insumos visuais e documentais, o projeto conta com uma **aplicação web interativa (Dashboard PWA-ready)** construída com arquitetura limpa em **JavaScript Modular (ES6)**. Essa interface permite que desenvolvedores, gestores de produto e designers naveguem, inspecionem e consumam **250 ativos de negócio catalogados em 38 diretórios**, oferecendo suporte ao vivo para visualização de **PDFs, planilhas Excel, vídeos MP4, imagens e código-fonte**.

Ao centralizar esses ativos neste repositório, garantimos que as aplicações core do ecossistema (`voltaexpress` e `voltaexpressbrasil`) permaneçam leves, focadas em código operacional e com máxima performance nos builds de produção.

---

## 🖥️ A Aplicação Web (Digital Hub Dashboard)

O repositório disponibiliza um **Dashboard Interativo** acessível via GitHub Pages, construído com uma arquitetura desacoplada e orientada a componentes puramente nativos (sem overhead de build):

* 🔍 **Busca Inteligente por Ativos:** Filtro em tempo real por nome de arquivo, tipo ou insight de produto.
* 📊 **Renderizador Multi-formato NATIVO:**
  * **Planilhas (`.xlsx`):** Leitura e renderização nativa de tabelas de dados via `SheetJS`.
  * **Documentos e Pitch Decks (`.pdf`):** Visualização embutida de alta fidelidade.
  * **Código & Mockups (`.js`, `.css`, `.json`):** Syntax Highlighting automático via `Prism.js`.
  * **Vídeos Ricos (`.mp4`):** Player nativo para releases, teasers e gravações de QA.
  * **Artes & Mídias (`.png`, `.jpg`, `.webp`):** Galeria e renderizador de fotos e assets.
* 💡 **Camada de Product Insights:** Cada arquivo possui um resumo executivo contextualizando seu valor para a regra de negócio da plataforma.

---

## 🏛️ Estrutura Arquitetural do Repositório

O projeto é dividido em **dois pilares fundamentais**: a **Camada de Aplicação (`js/`)** e o **Contêiner de Ativos (`assets/`)**.

```text
voltaexpressbrasil-digital/
├── index.html                            # Ponto de entrada HTML do Dashboard Hub
├── style.css                             # Estilos visuais, variáveis de tema e overrides
├── readme.md                             # Documentação mestre de governança
│
├── js/                                   # 🧠 CAMADA DE APLICAÇÃO (ES6 Modules)
│   ├── config.js                         # Constantes globais, caminhos base e ícones por extensão
│   ├── data.js                           # [DATA] Matriz de dados (Ativos físicos + Atalhos dinâmicos)
│   ├── renderers.js                      # [VIEWER] Motores de renderização (PDF, Excel, Video, Code, Img, DOCX, Cards)
│   ├── ui.js                             # [CONTROLLER] Lógica da árvore interativa, busca e interface
│   └── main.js                           # [BOOTSTRAP] Ponto de entrada de inicialização
│
│
└── assets/                               # 📦 CONTÊINER OFICIAL DE ATIVOS FÍSICOS
    ├── arquivos/                         # Documentos base e insumos de engenharia/negócios
    │   ├── banco-dados/                  # Especificações OpenAPI/Swagger e schemas
    │   ├── forms/                        # Respostas de pesquisas em .xlsx
    │   ├── json-dados/                   # Mocks e componentes de código (.js / .json)
    │   ├── parceiros/                    # Atas de reunião e acordos comerciais (.docx)
    │   ├── pitch/                        # Pitch decks (.pdf) e roteiros (.docx)
    │   ├── prototipo/                    # Prompts e especificação de prototipagem (.docx / Lovable)
    │   ├── qa-v5/                        # Fluxos funcionais da versão 5
    │   ├── supabase/                     # Prints de configuração de banco, Auth e RLS no Supabase
    │   ├── vaga-dev/                     # Desafios técnicos de contratação de devs
    │   └── 🌐 SEÇÕES VIRTUAIS & ATALHOS EM NUVEM (MAPEADOS VIA DATA/JS)
    │       ├── posicionamento-digital/           # 📌 Redes Sociais, GitHub, E-mails oficiais e Mídias
    │       ├── pesquisa-cliente-forms/           # 📋 Catálogo de 23 Formulários e Respostas do Microsoft Forms / OneDrive
    │       ├── benchmarking-produto/             # 💡 Requisitos SaaS (Doc com link Google Docs + Video Player YouTube)
    │       └── sistemas/                         # ⚙️ Infraestrutura, Hospedagem e DNS (Netlify & GoDaddy)
    │            ├── netlify/                      #    -> Deploys, Zonas de DNS, SSL e Docs do Netlify
    │            └── godaddy/                      #    -> Criador de Sites e Servidores GoDaddy
    ├── quero-carregar-transportador/     # Persona 1: Caminhoneiro / Motorista
    │   ├── anunciar-caminhao/            # Screenshots do fluxo de oferta de frota
    │   ├── buscar-carga/                 # Vitrine e busca de cargas/fretes
    │   ├── marca-transportador/          # Identidade visual e marcas auxiliares do transportador
    │   ├── persona/                      # Fotos e depoimentos da persona Motorista
    │   └── vantagem/                     # Cards visuais de benefícios para o caminhoneiro
    │
    ├── quero-transportar-embarcador/     # Persona 2: Embarcador / Empresa Contratante
    │   ├── anunciar-carga/               # Cadastro e publicação de ofertas de carga
    │   ├── buscar-caminhao/              # Vitrine de busca de caminhões/frotas
    │   ├── marca-embarcador/             # Identidade visual e mídias da empresa
    │   ├── persona-embarcador/           # Fotos e dados da persona Empresa
    │   └── vantagem-embarcador/          # Cards visuais de benefícios para o embarcador
    │
    └── voltaexpressbrasil/               # Central de Branding, Mídias e Institucional
        ├── inspiracoes/                  # Referências visuais do ecossistema
        │   ├── arts/                     # UI/UX de transporte e fotos de veículos
        │   └── mkt-campanhas/            # Artes para tráfego e campanhas
        ├── live/                         # Registros e gravações de reuniões corporativas
        ├── midias/                       # Vídeos ricos e demos
        │   └── videos/                   # Releases oficiais, gravações e demos (.mp4)
        ├── qa-infos/                     # Screenshots, legendas e evidências de testes de UI
        ├── qa-refs/                      # Tabelas de dimensões e tipos de caminhões
        ├── veb-assets/                   # Elementos visuais complementares da marca
        ├── veb-logo/                     # Logotipos oficiais em alta resolução (PNG, SVG, ICO)
        ├── veb-mkt-1/                    # Peças da Campanha MKT 01
        ├── veb-mkt-2/                    # Peças da Campanha MKT 02
        ├── veb-mkt-3/                    # Galeria conceitual de frotas e rodovias
        ├── veb-painel/                   # Imagens conceituais para composição do painel
        └── veb-public/                   # Favicons e manifestos PWA
```

---

## 🎯 Padrões de Uso e Governança

### 1. Padronização de Nomenclatura de Arquivos
Para evitar quebras de URL no GitHub Pages e garantir compatibilidade cross-platform (Web / PWA / Android / iOS / CDNs):
* **Sempre utilize `kebab-case`** em letras minúsculas para novos arquivos:  
  `logo-volta-express-fundo-amarelo.png` em vez de `Logo - Volta Express (1).png`.
* Evite acentos, espaços, parênteses e caracteres especiais na criação de pastas e arquivos.

### 2. Adição de Novos Ativos ao Hub
Sempre que novos ativos forem adicionados ao diretório `assets/`, a matriz de dados do Dashboard deve ser atualizada para manter o índice 100% sincronizado:
1. Adicione os arquivos físicos dentro da subpasta apropriada em `assets/`.
2. Registre os novos nós no arquivo `js/data.js` especificando: `name`, `type`, `ext`, `path` e o `insight` executivo do ativo.

### 3. Versionamento de Mídias Grandes
* Para arquivos de imagem, prefira os formatos `.webp` ou `.png` otimizados.
* Vídeos demonstrativos (`.mp4`) com tamanho superior a 50MB devem utilizar o **Git LFS** (*Large File Storage*).

---

## 🌿 Workflow de Branches e Deploy

Adotamos um fluxo rigoroso de ramos no Git para proteção do ambiente de produção:

* **`main`**: Branch de produção e ambiente live do GitHub Pages. Contém apenas o código homologado e os ativos finais aprovados.
* **`developer-mvp`**: Branch de desenvolvimento do MVP. Centraliza arquivos de trabalho, mídias de testes e validações antes da fusão.
* **`features/versao-docs`**: Branch dedicada a melhorias estruturais, refatoração de código, atualização do Dashboard e governança do `README.md`.

---

## 📋 Backlog de Evolução Técnica

- [x] **Arquitetura Modular ES6:** Refatoração do script monolítico para a estrutura limpa em `js/` (`config`, `data`, `renderers`, `ui`, `main`).
- [x] **Mapeamento do Repositório:** Catalogação visual e indexação de 100% dos 250 ativos de negócio em 38 diretórios.
- [ ] **Padronização de Nomenclatura:** Refatorar nomes de arquivos legados que contenham espaços ou parênteses para `kebab-case`.
- [ ] **Otimização de Mídias:** Compactar imagens pesadas em `assets/` convertendo para `.webp`.
- [ ] **Integração de Raw CDN Linker:** Adicionar na UI do Dashboard um botão de "Copiar URL Raw" para facilitar o uso dos ativos pelos devs no frontend.

---

## 🚀 Como Consumir os Ativos na Aplicação Web

Os desenvolvedores podem referenciar qualquer imagem, logo ou documento diretamente no frontend das aplicações utilizando a CDN Raw do GitHub:

```html
<!-- Exemplo de consumo do Logotipo Oficial -->
<img 
  src="[https://raw.githubusercontent.com/VoltaExpress/voltaexpressbrasil-digital/main/assets/voltaexpressbrasil/veb-logo/logo-completa.png](https://raw.githubusercontent.com/VoltaExpress/voltaexpressbrasil-digital/main/assets/voltaexpressbrasil/veb-logo/logo-completa.png)" 
  alt="Volta Express Brasil Logo"
/>

<!-- Exemplo de consumo da Persona Caminhoneiro -->
<img 
  src="[https://raw.githubusercontent.com/VoltaExpress/voltaexpressbrasil-digital/main/assets/quero-carregar-transportador/persona/caminhoneiro-1.png](https://raw.githubusercontent.com/VoltaExpress/voltaexpressbrasil-digital/main/assets/quero-carregar-transportador/persona/caminhoneiro-1.png)" 
  alt="Persona Caminhoneiro Volta Express"
/>
```

---

## 🌐 Seções Estratégicas & Atalhos de Ecossistema

O Dashboard conta com seções dinâmicas dedicadas à governança de produto, benchmarking, inteligência de mercado e links operacionais de infraestrutura. Cada seção renderiza cards interativos e responsivos no painel central:

### 1. 📌 Posicionamento Digital (`posicionamento-digital`)
Centraliza a presença oficial da **Volta Express Brasil** nas redes e canais de comunicação. Cada card exibe a identidade da plataforma, descrição e acesso direto via link seguro:
* ✉️ **Canais Corporativos:** Gmail Oficial (`voltaexpressbrasil@gmail.com`) e Outlook da operação.
* 💻 **Engenharia:** Repositórios Oficiais no GitHub (`github.com/VoltaExpress`).
* 📣 **Mídias Digitais:** Instagram (`@voltaexpressbrasil`), YouTube (`@VoltaExpress`), TikTok e Páginas de Interação e Personas no Facebook.

### 2. 📋 Pesquisa de Cliente via Form (`pesquisa-cliente-forms`)
Catálogo com **23 formulários e bases de dados** no Microsoft Forms e OneDrive, categorizados visualmente por badges coloridas:
* 🟢 **Ambiente de Produção (Público):** Formulários ativos de captação de rotas, ofertas de carga, cadastros e entrevistas qualitativas com caminhoneiros.
* 🟡 **Painel de Edição/Design:** Links de gerenciamento e rascunhos de questionários.
* 📊 **Bases de Respostas (.xlsx):** Planilhas consolidadas no OneDrive para análise contínua do time de Produto e Growth.

### 3. 💡 Benchmarking de Produto (`benchmarking-produto`)
Análise comparativa e arquitetura de negócios do ecossistema SaaS de logística:
* 📑 **Especificação Técnica de Requisitos:** Documento formatado em layout executivo cobrindo Objetivos do Produto, Modelo de Monetização por Assinatura, Perfis de Acesso (Embarcador, Motorista e Admin), Fluxos de Cadastro com OTP/Validação e Regras de Negócio de Anúncios. Inclui atalho direto para o [Google Docs Mestre Original](https://docs.google.com/document/d/1Ed-TkNVTAiny1Xiv3xlV9W00PTxt2zCB0k7mBfadyoc/edit?tab=t.0).
* 🎥 **Análise do Ecossistema em Vídeo:** Player embutido nativamente no Hub para assistir ao vídeo de referência do ecossistema sem sair da aplicação.

### 4. ⚙️ Infraestrutura & Sistemas (`sistemas`)
Subpastas organizadas para gestão dos provedores de hospedagem, zonas de DNS e construtores:
* ⚡ **Netlify (`sistemas/netlify`):** Atalhos para o painel de *Deploys/Builds*, Gerenciamento de Registros de DNS (`voltaexpress.com.br`), Certificados SSL e acervo de documentações técnicas oficiais (*netlify.toml*, papéis e permissões).
* 🌐 **GoDaddy (`sistemas/godaddy`):** Links para o Construtor de Sites e especificações dos servidores de Hospedagem.

---

## 🛡️ Contribuição e Licença

Este repositório é gerenciado internamente pela equipe de Produto e Engenharia da **Volta Express Brasil**. Alterações na estrutura de dados, diretórios de marca ou inclusão de novos materiais devem passar por aprovação da liderança técnica (PM / CTO).

* **Organização no GitHub:** [github.com/VoltaExpress](https://github.com/VoltaExpress)
* **Domínio Oficial:** [voltaexpressbrasil.com.br](https://voltaexpressbrasil.com.br)
* **Repositório Digital Hub:** [voltaexpressbrasil-digital](https://github.com/VoltaExpress/voltaexpressbrasil-digital)