/**
 * Hub Volta Express — as 8 seções.
 * Cada função recebe o <main> e desenha a seção a partir dos dados de data/*.json.
 * Nenhum número é escrito à mão aqui: tudo vem dos dados (e cada dado tem fonte e data).
 */
import { ROTULOS, CORES_PROJETO, PALETA, CONFIG } from "./config.js";
import { carregar, carregarTexto, materiais } from "./data.js";
import {
  esc, num, pct, data, mb, cabecalho, kpi, comparacao, tabela,
  barrasHorizontais, colunasEmpilhadas, peca,
} from "./renderers.js";

const fonte = (texto, quando) =>
  `<p class="fonte"><i class="bx bx-link" aria-hidden="true"></i> Fonte: ${esc(texto)}${quando ? ` · ${esc(quando)}` : ""}</p>`;
const imprimirCabecalho = (titulo) =>
  `<p class="imprimir-cabecalho">Hub Volta Express · ${esc(titulo)} · impresso em ${new Date().toLocaleDateString("pt-BR")}</p>`;

/* ======================================================================
   1. Visão geral
   ====================================================================== */
const SECOES = [
  { rota: "relatorios", icone: "bx-file", titulo: "Relatórios", texto: "Diagnósticos, resultados e decisões dos 3 projetos, sempre na versão mais recente." },
  { rota: "pesquisa", icone: "bx-bar-chart-alt-2", titulo: "Pesquisa", texto: "O que embarcadores e caminhoneiros responderam, em números agregados e anônimos." },
  { rota: "demonstracoes", icone: "bx-play-circle", titulo: "Demonstrações", texto: "Vídeos, fluxos de tela e protótipos de cada versão do produto." },
  { rota: "explicacoes", icone: "bx-bulb", titulo: "Explicações", texto: "Como o match funciona, tipos de caminhão, o que medimos e por quê." },
  { rota: "jornada", icone: "bx-git-commit", titulo: "Jornada", texto: "A história da startup em commits e marcos, com a fonte de cada data." },
  { rota: "marca", icone: "bx-palette", titulo: "Marca", texto: "Cores, logotipos e campanhas para baixar e usar." },
  { rota: "acervo", icone: "bx-images", titulo: "Acervo", texto: "Todos os materiais públicos, com busca e filtros." },
];

export async function visaoGeral(app) {
  const [jornada, pesquisa, conteudo, metricas] = await Promise.all([
    carregar("jornada"), carregar("pesquisa"), carregar("conteudo"), carregar("metricas"),
  ]);
  const unicos = conteudo.itens.filter((i) => !i.duplicado_de);
  const respostas = pesquisa.grupos.reduce((s, g) => s + g.respostas, 0);
  const ultimoCommit = Object.values(jornada.projetos).map((p) => p.ultimo).filter(Boolean).sort().pop();
  const periodo = pesquisa.metodologia.periodo;

  app.innerHTML = `
    ${imprimirCabecalho("Visão geral")}
    ${cabecalho({
      eyebrow: "Central de evidências",
      titulo: "Volta Express em números, documentos e demonstrações",
      lead: "O ecossistema que conecta caminhões que voltariam vazios a cargas no caminho. Aqui cada número tem fonte e data, e cada material serve para explicar, demonstrar ou provar algo.",
    })}

    <div class="grid grid-4">
      ${kpi({ valor: "3", rotulo: "Projetos no ecossistema", fonte: "Landing, plataforma e Hub" })}
      ${kpi({ valor: num(jornada.total_commits), rotulo: "Commits nos 3 projetos", fonte: `git log · último em ${data(ultimoCommit)}` })}
      ${kpi({ valor: num(respostas), rotulo: "Respostas de pesquisa", fonte: `${pesquisa.grupos.length} formulários · ${periodo ? data(periodo.de.slice(0, 7)) : ""}` })}
      ${kpi({ valor: num(unicos.length), rotulo: "Materiais no acervo", fonte: `${conteudo.resumo.duplicados} cópias idênticas removidas` })}
    </div>

    <section class="section">
      <div class="north-star">
        <i class="bx bx-target-lock" aria-hidden="true"></i>
        <div>
          <h2>North Star: fretes de retorno conectados por mês</h2>
          <p>É o número que resume o valor da Volta Express: cada contato entre um caminhoneiro e uma carga na volta é uma viagem que não roda vazia.
          <strong>Ainda sem dado real:</strong> ele virá da tabela <code>vt_match_evento</code> da plataforma, quando ela estiver em produção.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Resultados medidos</h2>
      <p class="section-lead">Antes e depois das últimas entregas. Verde = mudou na direção desejada; vermelho = piorou.</p>
      <div class="grid grid-2">
        ${metricas.blocos.map((b) => `
          <article class="card">
            <h3>${esc(b.titulo)}</h3>
            ${comparacao(b.indicadores)}
            ${fonte(b.fonte, `medido em ${data(b.medido_em)}`)}
            <details class="dados"><summary>Como foi medido</summary><p class="fonte">${esc(b.metodo)}</p></details>
          </article>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2>O que você encontra aqui</h2>
      <div class="grid grid-3">
        ${SECOES.map((s) => `
          <a class="card" href="#/${s.rota}">
            <span class="card-icon"><i class="bx ${s.icone}" aria-hidden="true"></i></span>
            <h3>${s.titulo}</h3>
            <p>${s.texto}</p>
          </a>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2>Marcos recentes</h2>
      <div class="card">
        <ol class="timeline">${jornada.marcos.slice(-4).reverse().map(marco).join("")}</ol>
        <p class="fonte"><a href="#/jornada">Ver a jornada completa →</a></p>
      </div>
    </section>`;
}

/* ======================================================================
   2. Relatórios (lista e leitura)
   ====================================================================== */
export async function relatorios(app, id) {
  const { itens, gerado_em } = await carregar("relatorios");
  if (id) return lerRelatorio(app, itens.find((r) => r.id === id));
  const projetos = ["Landing", "Plataforma", "Hub"];
  app.innerHTML = `
    ${imprimirCabecalho("Relatórios")}
    ${cabecalho({
      eyebrow: "Relatórios, análises e explicações",
      titulo: "Documentos dos projetos",
      lead: `Cópia publicada dos documentos que cada projeto mantém em Markdown. Atualizados pelo script <code>gerar_relatorios.py</code> em ${data(gerado_em)}.`,
    })}
    ${projetos.map((p) => {
      const doProjeto = itens.filter((r) => r.projeto === p);
      if (!doProjeto.length) return "";
      return `<section class="section">
        <h2>${p}</h2>
        <div class="grid grid-3">${doProjeto.map((r) => `
          <a class="card" href="#/relatorios/${esc(r.id)}">
            <span class="tag tag-${p.toLowerCase()}">${esc(ROTULOS.tipoRelatorio[r.tipo])}</span>
            <h3 style="margin-top:.6rem">${esc(r.titulo)}</h3>
            <p>${esc(r.resumo)}</p>
            <div class="meta"><span>Atualizado em ${data(r.atualizado)}</span><span>${Math.max(1, Math.round(r.palavras / 200))} min de leitura</span></div>
          </a>`).join("")}
        </div></section>`;
    }).join("")}`;
}

async function lerRelatorio(app, r) {
  if (!r) {
    app.innerHTML = `<p class="vazio">Relatório não encontrado. <a href="#/relatorios">Voltar à lista</a></p>`;
    return;
  }
  const html = await carregarTexto(r.arquivo);
  app.innerHTML = `
    ${imprimirCabecalho(r.titulo)}
    <p><a class="btn btn-ghost btn-sm" href="#/relatorios"><i class="bx bx-arrow-back" aria-hidden="true"></i> Todos os relatórios</a></p>
    ${cabecalho({ eyebrow: `${r.projeto} · ${ROTULOS.tipoRelatorio[r.tipo]}`, titulo: r.titulo })}
    <div class="relatorio-meta">
      <span><i class="bx bx-calendar" aria-hidden="true"></i> Atualizado em ${data(r.atualizado)}</span>
      <span><i class="bx bx-time" aria-hidden="true"></i> ${Math.max(1, Math.round(r.palavras / 200))} min de leitura</span>
      <span><i class="bx bx-git-repo-forked" aria-hidden="true"></i> Fonte: <code>${esc(r.fonte)}</code></span>
    </div>
    <article class="artigo">${html}</article>`;
}

/* ======================================================================
   3. Pesquisa
   ====================================================================== */
function valorDe(pergunta, rotulo) {
  return pergunta?.dados.find((d) => d.rotulo === rotulo)?.valor ?? 0;
}
const maior = (pergunta) => pergunta.dados.filter((d) => !/^Outros|^Não /.test(d.rotulo)).sort((a, b) => b.valor - a.valor)[0];

function achadosDaPesquisa(pesquisa) {
  const g = Object.fromEntries(pesquisa.grupos.map((x) => [x.id, x]));
  const q = (grupo, id) => g[grupo]?.perguntas.find((p) => p.id === id);
  const lista = [];
  const emb = g.embarcadores, cam = g.caminhoneiros;
  if (emb) {
    const merc = maior(q("embarcadores", "mercadoria"));
    lista.push(`<strong>${esc(merc.rotulo)}</strong> é a mercadoria mais citada pelos embarcadores: ${merc.valor} de ${emb.respostas} (${pct(merc.valor, emb.respostas)}%).`);
    const naoVol = valorDe(q("embarcadores", "volume"), "Não informou");
    lista.push(`<strong>${pct(naoVol, emb.respostas)}% dos embarcadores não informaram o volume</strong> da carga (${naoVol} de ${emb.respostas}). Sem volume, não dá para saber se a carga cabe no caminhão — por isso a plataforma passou a exigir peso e volume no anúncio.`);
    const coleta = maior(q("embarcadores", "uf_origem"));
    lista.push(`${coleta.valor} de ${emb.respostas} coletas (${pct(coleta.valor, emb.respostas)}%) saem de <strong>${esc(coleta.rotulo)}</strong>.`);
  }
  if (cam) {
    const tipo = maior(q("caminhoneiros", "tipo_caminhao"));
    lista.push(`<strong>${esc(tipo.rotulo)}</strong> é o caminhão mais comum entre os caminhoneiros: ${tipo.valor} de ${cam.respostas} (${pct(tipo.valor, cam.respostas)}%).`);
    const capacidade = q("caminhoneiros", "capacidade");
    const leves = valorDe(capacidade, "Até 5 t") + valorDe(capacidade, "5 a 14 t");
    lista.push(`<strong>${pct(leves, cam.respostas)}% oferecem até 14 toneladas</strong> livres (${leves} de ${cam.respostas}): o perfil é de caminhão leve e médio, não de carreta.`);
    const inicio = maior(q("caminhoneiros", "uf_origem"));
    const fim = maior(q("caminhoneiros", "uf_destino"));
    lista.push(`As rotas dos caminhoneiros começam sobretudo em <strong>${esc(inicio.rotulo)}</strong> (${pct(inicio.valor, cam.respostas)}%) e terminam em <strong>${esc(fim.rotulo)}</strong> (${pct(fim.valor, cam.respostas)}%).`);
    if (emb) {
      const coleta = maior(q("embarcadores", "uf_origem"));
      const coletaNoFim = valorDe(q("embarcadores", "uf_origem"), fim.rotulo);
      lista.push(`<strong>Análise cruzada:</strong> a oferta de carga se concentra em ${esc(coleta.rotulo)} e a de caminhões começa em ${esc(inicio.rotulo)}. Para o caminhoneiro que termina em ${esc(fim.rotulo)} voltar cheio, ele precisa de carga saindo de ${esc(fim.rotulo)} — ${coletaNoFim ? `${coletaNoFim} embarcador(es) da amostra coletam lá` : `nenhum grupo de 3 ou mais embarcadores da amostra coleta lá`}. Esse descompasso é exatamente o problema que o match por rota tenta resolver.`);
    }
  }
  return lista;
}

export async function pesquisa(app) {
  const p = await carregar("pesquisa");
  const m = p.metodologia;
  const total = p.grupos.reduce((s, g) => s + g.respostas, 0);
  app.innerHTML = `
    ${imprimirCabecalho("Pesquisa")}
    ${cabecalho({
      eyebrow: "Pesquisa com o público",
      titulo: "O que embarcadores e caminhoneiros nos contaram",
      lead: `${total} respostas a ${p.grupos.length} formulários de interesse${m.periodo ? `, com coletas previstas entre ${data(m.periodo.de)} e ${data(m.periodo.ate)}` : ""}. Os números são agregados: nenhuma pessoa pode ser identificada.`,
    })}

    <section class="section">
      <h2>Principais achados</h2>
      <div class="card"><ul class="achados">${achadosDaPesquisa(p).map((a) => `<li><i class="bx bx-check-circle" aria-hidden="true"></i><span>${a}</span></li>`).join("")}</ul></div>
    </section>

    ${p.grupos.map((g) => `
      <section class="section">
        <h2>${esc(g.titulo)} <span class="tag tag-pesquisa">${g.respostas} respostas</span></h2>
        <p class="section-lead">${esc(g.descricao)}</p>
        <div class="grid grid-2">
          ${g.perguntas.map((q) => `
            <article class="card">
              <h3>${esc(q.titulo)}</h3>
              ${barrasHorizontais(q.dados, { total: g.respostas, titulo: `${g.titulo}: ${q.titulo}` })}
            </article>`).join("")}
        </div>
      </section>`).join("")}

    <section class="section">
      <h2>Metodologia e limites</h2>
      <div class="card">
        <p><strong>Fonte:</strong> ${esc(m.fonte)}.</p>
        <p style="margin-top:.6rem"><strong>Como os dados foram protegidos:</strong></p>
        <ul class="achados" style="margin-top:.4rem">${m.anonimizacao.map((a) => `<li><i class="bx bx-shield-quarter" aria-hidden="true"></i><span>${esc(a)}</span></li>`).join("")}</ul>
        <div class="aviso" style="margin-top:1rem"><i class="bx bx-error-circle" aria-hidden="true"></i><span><strong>Limite:</strong> ${esc(m.limitacoes)}</span></div>
        ${m.excluidos?.length ? `<p class="fonte">Fora da análise: ${m.excluidos.map((e) => `"${esc(e.formulario)}" (${e.respostas} resposta${e.respostas === 1 ? "" : "s"}, ${esc(e.motivo)})`).join("; ")}.</p>` : ""}
        ${fonte("data/pesquisa.json, gerado por scripts/gerar_pesquisa.py", `em ${data(p.gerado_em)}`)}
      </div>
    </section>`;
}

/* ======================================================================
   4. Demonstrações
   ====================================================================== */
function porColecao(itens) {
  const mapa = new Map();
  for (const i of itens) {
    const chave = i.colecao || "Outros";
    if (!mapa.has(chave)) mapa.set(chave, []);
    mapa.get(chave).push(i);
  }
  return [...mapa.entries()];
}

function galeriaColecao(nome, itens, limite = 8) {
  const link = `#/acervo?colecao=${encodeURIComponent(nome)}`;
  return `<section class="section">
    <h2>${esc(nome)} <span class="tag">${itens.length}</span></h2>
    <div class="galeria">${itens.slice(0, limite).map(peca).join("")}</div>
    ${itens.length > limite ? `<p class="fonte"><a href="${link}">Ver os ${itens.length} no acervo →</a></p>` : ""}
  </section>`;
}

export async function demonstracoes(app) {
  const todos = await materiais();
  const demos = todos.filter((i) => i.finalidade === "demonstracao");
  const videos = demos.filter((i) => i.formato === "video");
  const outros = demos.filter((i) => i.formato !== "video");
  app.innerHTML = `
    ${imprimirCabecalho("Demonstrações")}
    ${cabecalho({
      eyebrow: "Demonstrações",
      titulo: "O produto em movimento",
      lead: "Vídeos das versões, fluxos de tela e o código dos protótipos. Clique para ver em tamanho grande, com a data e a fonte de cada material.",
    })}
    <section class="section">
      <h2>Vídeos</h2>
      <p class="section-lead">O vídeo só é baixado quando você aperta o play.</p>
      <div class="galeria galeria-grande">${videos.map(peca).join("") || `<p class="vazio">Nenhum vídeo público.</p>`}</div>
    </section>
    ${porColecao(outros).map(([nome, itens]) => galeriaColecao(nome, itens)).join("")}
    <section class="section">
      <div class="aviso"><i class="bx bx-info-circle" aria-hidden="true"></i><span>Roteiro completo de demonstração do Match v2 (usuários e anúncios de teste): fica no repositório da plataforma, porque contém credenciais de teste. Os resultados esperados estão em <a href="#/relatorios/plataforma-match">Especificação do Match v2</a>.</span></div>
    </section>`;
}

/* ======================================================================
   5. Explicações
   ====================================================================== */
export async function explicacoes(app) {
  const [{ itens }, pesquisaDados] = await Promise.all([carregar("explicacoes"), carregar("pesquisa").catch(() => null)]);
  const porId = Object.fromEntries(itens.map((i) => [i.id, i]));
  const blocos = [];

  const match = porId["como-funciona-o-match"];
  if (match) blocos.push(`
    <section class="section" id="match">
      <h2>${esc(match.titulo)}</h2>
      <p class="section-lead">${esc(match.resumo)}</p>
      <div class="etapas">${match.etapas.map((e) => `<div class="card"><h3>${esc(e.titulo)}</h3><p>${esc(e.texto)}</p></div>`).join("")}</div>
      <div class="card" style="margin-top:1rem">
        <h3>Peso de cada critério no score (total 100)</h3>
        ${barrasHorizontais(match.pesos, { titulo: "Pesos do score do match", sufixo: " pts", cor: "var(--color-brand-text)" })}
        ${fonte(match.fonte)}
        <p class="fonte"><a href="#/relatorios/plataforma-match">Ler a especificação completa →</a></p>
      </div>
    </section>`);

  const tipos = porId["tipos-de-caminhao"];
  if (tipos) {
    const perguntaTipo = pesquisaDados?.grupos.find((g) => g.id === "caminhoneiros")?.perguntas.find((q) => q.id === "tipo_caminhao");
    const nCam = pesquisaDados?.grupos.find((g) => g.id === "caminhoneiros")?.respostas;
    const truck = perguntaTipo ? valorDe(perguntaTipo, "Truck") : 0;
    blocos.push(`
    <section class="section" id="caminhoes">
      <h2>${esc(tipos.titulo)}</h2>
      <p class="section-lead">${esc(tipos.resumo)}</p>
      <div class="grid grid-2">
        <div class="card"><h3>Capacidade de peso (t)</h3>${barrasHorizontais(tipos.tabela.map((t) => ({ rotulo: t.tipo, valor: t.peso_t })), { titulo: "Capacidade de peso por tipo de caminhão", sufixo: " t" })}</div>
        <div class="card"><h3>Capacidade de volume (m³)</h3>${barrasHorizontais(tipos.tabela.map((t) => ({ rotulo: t.tipo, valor: t.volume_m3 })), { titulo: "Capacidade de volume por tipo de caminhão", sufixo: " m³", cor: "var(--color-whatsapp)" })}</div>
      </div>
      ${truck ? `<div class="aviso" style="margin-top:1rem"><i class="bx bx-link" aria-hidden="true"></i><span>Ligação com a pesquisa: o <strong>Truck</strong> (11 t, 58 m³) foi o tipo mais citado pelos caminhoneiros — ${truck} de ${nCam} respostas. <a href="#/pesquisa">Ver pesquisa →</a></span></div>` : ""}
      ${fonte(tipos.fonte)}
    </section>`);
  }

  const compat = porId["carga-e-carroceria"];
  if (compat) blocos.push(`
    <section class="section">
      <h2>${esc(compat.titulo)}</h2>
      <p class="section-lead">${esc(compat.resumo)}</p>
      ${tabela([{ titulo: "Categoria da carga", chave: "carga" }, { titulo: "Carrocerias aceitas", chave: "carrocerias" }], compat.compatibilidade)}
      ${fonte(compat.fonte)}
    </section>`);

  const ns = porId["north-star-e-funil"];
  if (ns) blocos.push(`
    <section class="section">
      <h2>${esc(ns.titulo)}</h2>
      <p class="section-lead">${esc(ns.resumo)}</p>
      <ol class="funil">${ns.funil.map((etapa, i) => `<li style="margin-left:${i * 10}px"><span>${String(i + 1).padStart(2, "0")}</span>${esc(etapa)}</li>`).join("")}</ol>
      ${fonte(ns.fonte)}
    </section>`);

  const glos = porId["como-ler-os-indicadores"];
  if (glos) blocos.push(`
    <section class="section">
      <h2>${esc(glos.titulo)}</h2>
      <p class="section-lead">${esc(glos.resumo)}</p>
      <div class="card"><dl class="glossario">${glos.glossario.map((g) => `<dt>${esc(g.termo)}</dt><dd>${esc(g.texto)}</dd>`).join("")}</dl></div>
      ${fonte(glos.fonte)}
    </section>`);

  app.innerHTML = `
    ${imprimirCabecalho("Explicações")}
    ${cabecalho({ eyebrow: "Explicações", titulo: "Como as coisas funcionam", lead: "As regras do produto e os conceitos por trás dos números, cada um com o documento de origem." })}
    ${blocos.join("")}`;
}

/* ======================================================================
   6. Jornada
   ====================================================================== */
function marco(m) {
  const chave = { Landing: "landing", Plataforma: "plataforma", Hub: "hub" }[m.projeto];
  return `<li class="marco">
    <time datetime="${esc(m.data)}">${data(m.data)}</time> <span class="tag ${chave ? `tag-${chave}` : "tag-pesquisa"}">${esc(m.projeto)}</span>
    <h3>${esc(m.titulo)}</h3>
    <p>${esc(m.descricao)}</p>
    <p class="fonte">Fonte: ${esc(m.fonte)}</p>
  </li>`;
}

export async function jornada(app) {
  const j = await carregar("jornada");
  const series = Object.entries(j.projetos).map(([chave, p]) => ({
    nome: CORES_PROJETO[chave]?.nome || p.nome,
    cor: CORES_PROJETO[chave]?.cor || "#64748b",
    valores: j.meses.map((m) => p.por_mes[m] || 0),
  }));
  const plataforma = j.projetos.plataforma;
  app.innerHTML = `
    ${imprimirCabecalho("Jornada")}
    ${cabecalho({
      eyebrow: "Jornada",
      titulo: "Da primeira linha de código à versão 7",
      lead: `${num(j.total_commits)} commits nos 3 repositórios, de ${data(j.meses[0])} a ${data(j.meses[j.meses.length - 1])}. Os números saem direto do Git: qualquer pessoa pode conferir.`,
    })}
    <div class="grid grid-3">
      ${Object.entries(j.projetos).map(([chave, p]) => kpi({
        valor: num(p.commits),
        rotulo: `commits · ${CORES_PROJETO[chave]?.nome || p.nome}`,
        fonte: `${data(p.primeiro)} → ${data(p.ultimo)}`,
      })).join("")}
    </div>
    <section class="section">
      <h2>Commits por mês</h2>
      <p class="section-lead">Sem contar merges. Meses sem barra não tiveram commits.</p>
      <div class="card">${colunasEmpilhadas(j.meses, series, { titulo: "Commits por mês e por projeto" })}${fonte(j.fonte, `gerado em ${data(j.gerado_em)}`)}</div>
      ${plataforma?.primeiro && plataforma.primeiro < "2026-01-01" ? `<div class="aviso" style="margin-top:1rem"><i class="bx bx-error-circle" aria-hidden="true"></i><span>O primeiro commit da plataforma (${data(plataforma.primeiro)}) é o modelo gerado pelo Lovable, com data fixa. O trabalho real começa em fev/2026, com a primeira migração do banco.</span></div>` : ""}
    </section>
    <section class="section">
      <h2>Marcos</h2>
      <div class="card"><ol class="timeline">${j.marcos.slice().reverse().map(marco).join("")}</ol></div>
    </section>`;
}

/* ======================================================================
   7. Marca
   ====================================================================== */
export async function marca(app) {
  const [todos, conteudo] = await Promise.all([materiais(), carregar("conteudo")]);
  const colecao = (nome) => todos.filter((i) => i.colecao === nome && i.formato === "imagem");
  app.innerHTML = `
    ${imprimirCabecalho("Marca")}
    ${cabecalho({ eyebrow: "Marca", titulo: "Identidade Volta Express", lead: "As mesmas cores e a mesma fonte da landing v7. Clique em uma peça para ver e baixar o arquivo original." })}
    <section class="section">
      <h2>Cores</h2>
      <p class="section-lead">Definidas em <code>shared/tokens.css</code>, com o contraste medido pela fórmula da WCAG.</p>
      <div class="paleta">${PALETA.map((c) => `
        <div class="cor">
          <div class="cor-amostra" style="background:${c.hex}"></div>
          <div class="cor-info"><strong>${esc(c.nome)}</strong><code>${c.hex}</code> · <code>${esc(c.token)}</code><br />${esc(c.uso)}<br /><span class="fonte">${esc(c.contraste)}</span></div>
        </div>`).join("")}
      </div>
    </section>
    <section class="section">
      <h2>Tipografia</h2>
      <div class="card">
        <p style="font-size:2rem;font-weight:700;line-height:1.2">Poppins 700 — Sua carga no caminhão certo</p>
        <p style="font-size:1.25rem;font-weight:600;margin-top:.5rem">Poppins 600 — Títulos de seção e botões</p>
        <p style="margin-top:.5rem">Poppins 400 — Texto corrido, com tamanho base de 16 px e altura de linha 1,6.</p>
      </div>
    </section>
    ${["Logotipos", "Campanha MKT 01", "Campanha MKT 02", "Frotas e rodovias", "Persona caminhoneiro", "Persona embarcador"]
      .map((n) => [n, colecao(n)]).filter(([, i]) => i.length).map(([n, i]) => galeriaColecao(n, i, 12)).join("")}
    <section class="section">
      <h2>Canais oficiais</h2>
      <div class="grid grid-4">${conteudo.links.map((l) => `
        <a class="card" href="${esc(l.url)}" target="_blank" rel="noopener">
          <h3>${esc(l.titulo)}</h3><p class="fonte">${esc(l.url.replace("https://", ""))}</p>
        </a>`).join("")}
      </div>
    </section>`;
}

/* ======================================================================
   8. Acervo (busca e filtros; estado na URL para poder compartilhar o link)
   ====================================================================== */
export async function acervo(app, parametros) {
  const { itens: catalogo, resumo } = await carregar("conteudo");
  // Peças com imagem primeiro (o catálogo vem em ordem de pasta, com o código dos protótipos no topo).
  const itens = [...catalogo].sort((a, b) => Number(!(a.mini || a.capa)) - Number(!(b.mini || b.capa)));
  const estado = {
    q: parametros.get("q") || "",
    finalidade: parametros.get("finalidade") || "",
    formato: parametros.get("formato") || "",
    persona: parametros.get("persona") || "",
    colecao: parametros.get("colecao") || "",
    dup: parametros.get("dup") === "1",
  };
  let limite = CONFIG.porPagina;
  const colecoes = [...new Set(itens.map((i) => i.colecao).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  // Só oferece opções que existem no catálogo, com a contagem (ex.: "Marca (84)").
  const opcoes = (mapa, atual, campo) => Object.entries(mapa)
    .map(([v, r]) => [v, r, itens.filter((i) => i[campo] === v && !i.duplicado_de).length])
    .filter(([v, , n]) => n > 0 || v === atual)
    .map(([v, r, n]) => `<option value="${v}" ${v === atual ? "selected" : ""}>${esc(r)} (${n})</option>`).join("");

  app.innerHTML = `
    ${imprimirCabecalho("Acervo")}
    ${cabecalho({
      eyebrow: "Acervo",
      titulo: "Todos os materiais públicos",
      lead: `${num(resumo.total - resumo.duplicados)} materiais únicos, catalogados por script a partir das pastas. As imagens abrem em versão leve (WebP); o original fica disponível para baixar.`,
    })}
    <form class="filtros" role="search" onsubmit="return false">
      <label class="sr-only" for="f-q">Buscar</label>
      <input type="search" id="f-q" placeholder="Buscar por título, resumo ou coleção" value="${esc(estado.q)}" autocomplete="off" />
      <label class="sr-only" for="f-finalidade">Finalidade</label>
      <select id="f-finalidade"><option value="">Todas as finalidades</option>${opcoes(ROTULOS.finalidade, estado.finalidade, "finalidade")}</select>
      <label class="sr-only" for="f-formato">Formato</label>
      <select id="f-formato"><option value="">Todos os formatos</option>${opcoes(ROTULOS.formato, estado.formato, "formato")}</select>
      <label class="sr-only" for="f-persona">Persona</label>
      <select id="f-persona"><option value="">Todas as personas</option>${opcoes(ROTULOS.persona, estado.persona, "persona")}</select>
      <label class="sr-only" for="f-colecao">Coleção</label>
      <select id="f-colecao"><option value="">Todas as coleções</option>${colecoes.map((c) => `<option ${c === estado.colecao ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
      <label class="chip" style="display:inline-flex;align-items:center;gap:.4rem"><input type="checkbox" id="f-dup" ${estado.dup ? "checked" : ""} /> Mostrar cópias idênticas</label>
    </form>
    <p class="contador" id="contador" aria-live="polite"></p>
    <div class="galeria" id="galeria"></div>
    <p style="text-align:center;margin-top:1.5rem"><button class="btn btn-ghost" type="button" id="mais">Carregar mais</button></p>`;

  const normal = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const desenhar = () => {
    const termo = normal(estado.q);
    const filtrados = itens.filter((i) =>
      (estado.dup || !i.duplicado_de) &&
      (!estado.finalidade || i.finalidade === estado.finalidade) &&
      (!estado.formato || i.formato === estado.formato) &&
      (!estado.persona || i.persona === estado.persona) &&
      (!estado.colecao || i.colecao === estado.colecao) &&
      (!termo || normal(`${i.titulo} ${i.resumo} ${i.colecao}`).includes(termo)));
    document.getElementById("contador").textContent = `${filtrados.length} ${filtrados.length === 1 ? "material" : "materiais"}`;
    document.getElementById("galeria").innerHTML = filtrados.slice(0, limite).map(peca).join("") || `<p class="vazio">Nada encontrado com esses filtros.</p>`;
    document.getElementById("mais").hidden = filtrados.length <= limite;
  };
  const sincronizarUrl = () => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(estado)) if (v) p.set(k, v === true ? "1" : v);
    history.replaceState(null, "", `#/acervo${p.toString() ? `?${p}` : ""}`);
  };
  const ligar = (id, chave, evento = "input") => document.getElementById(id).addEventListener(evento, (e) => {
    estado[chave] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    limite = CONFIG.porPagina;
    sincronizarUrl();
    desenhar();
  });
  ligar("f-q", "q");
  ["finalidade", "formato", "persona", "colecao"].forEach((k) => ligar(`f-${k}`, k, "change"));
  ligar("f-dup", "dup", "change");
  document.getElementById("mais").addEventListener("click", () => { limite += CONFIG.porPagina; desenhar(); });
  desenhar();
}
