/**
 * Hub Volta Express — peças visuais reutilizáveis.
 * Gráficos em SVG desenhados à mão (sem biblioteca): escala linear simples, rótulos legíveis,
 * e sempre uma tabela com os mesmos números para quem usa leitor de tela ou quer conferir.
 */
import { ROTULOS } from "./config.js";

/* --- Texto e formatos --- */
export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const NUM = new Intl.NumberFormat("pt-BR");
export const num = (v, casas = 0) =>
  typeof v === "number" ? new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(v) : esc(v);
export const pct = (parte, total) => (total ? Math.round((parte / total) * 100) : 0);

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
/** "2026-10-27" → "27/10/2026"; "2026-10" → "out/2026". Sem objeto Date: evita erro de fuso. */
export function data(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return d ? `${d}/${m}/${a}` : `${MESES[Number(m) - 1]}/${a}`;
}
export const mb = (bytes) => (bytes >= 1e6 ? `${num(bytes / 1e6, 1)} MB` : `${NUM.format(Math.max(1, Math.round(bytes / 1e3)))} KB`);
export const duracao = (s) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "");

/* --- Componentes --- */
export function cabecalho({ eyebrow, titulo, lead }) {
  return `<header class="page-head">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
    <h1>${esc(titulo)}</h1>
    ${lead ? `<p>${lead}</p>` : ""}
  </header>`;
}

export function kpi({ valor, rotulo, fonte }) {
  return `<div class="kpi">
    <div class="kpi-valor">${valor}</div>
    <div class="kpi-rotulo">${esc(rotulo)}</div>
    ${fonte ? `<div class="kpi-fonte">${esc(fonte)}</div>` : ""}
  </div>`;
}

/** Variação entre antes e depois, colorida conforme o sentido desejado ("menor" ou "maior" é melhor). */
function delta({ antes, depois, melhor }) {
  if (typeof antes !== "number" || typeof depois !== "number" || antes === depois) {
    return `<span class="delta delta-neutro">igual</span>`;
  }
  // A seta mostra o sentido da mudança; a cor mostra se foi para o lado desejado.
  const melhorou = melhor === "menor" ? depois < antes : depois > antes;
  const seta = depois > antes ? "▲" : "▼";
  const texto = depois === 0 && antes > 0 ? "zerado"
    : antes === 0 ? `+${num(depois)}`
    : `${depois > antes ? "+" : "−"}${num(Math.abs(((depois - antes) / antes) * 100))}%`;
  const sentido = melhorou ? "melhorou" : "piorou";
  return `<span class="delta ${melhorou ? "delta-bom" : "delta-ruim"}" title="${sentido}">${seta} ${esc(texto)}<span class="sr-only"> (${sentido})</span></span>`;
}

export function comparacao(indicadores) {
  return `<ul class="comparacao">${indicadores.map((i) => `
    <li>
      <span>${esc(i.nome)}</span>
      <span class="valores">${num(i.antes, 1)} → <strong>${num(i.depois, 1)}</strong> ${esc(i.unidade || "")}</span>
      ${delta(i)}
    </li>`).join("")}</ul>`;
}

export function tabela(colunas, linhas) {
  return `<div class="tabela-wrap"><table class="tabela">
    <thead><tr>${colunas.map((c) => `<th class="${c.num ? "num" : ""}" scope="col">${esc(c.titulo)}</th>`).join("")}</tr></thead>
    <tbody>${linhas.map((l) => `<tr>${colunas.map((c) => `<td class="${c.num ? "num" : ""}">${c.html ? l[c.chave] : esc(l[c.chave])}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

/* --- Gráfico de barras horizontais (categorias) ---
   dados: [{rotulo, valor}] · mostra valor e % do total · a maior barra ocupa a largura útil.
   Feito em HTML/CSS (não SVG) para o texto manter o tamanho real no celular e o rótulo poder quebrar linha.
   Cada linha é lida pelo leitor de tela como "rótulo: valor". */
export function barrasHorizontais(dados, { total, titulo, cor = "var(--color-primary)", sufixo = "" } = {}) {
  const soma = total ?? dados.reduce((s, d) => s + d.valor, 0);
  const max = Math.max(...dados.map((d) => d.valor), 1);
  const comPct = soma && !sufixo;
  const texto = (d) => (comPct ? `${num(d.valor)} (${pct(d.valor, soma)}%)` : `${num(d.valor, 1)}${sufixo}`);
  const linhas = dados.map((d) => `<li class="barra">
      <span class="barra-rotulo">${esc(d.rotulo)}</span>
      <span class="barra-trilho" aria-hidden="true"><span class="barra-valor" style="width:${Math.max(1, (d.valor / max) * 100).toFixed(1)}%;background:${cor}"></span></span>
      <span class="barra-numero"><span class="sr-only">: </span>${esc(texto(d))}</span>
    </li>`).join("");
  return `<figure class="barras-fig">
    <ul class="barras" aria-label="${esc(titulo || "Gráfico de barras")}">${linhas}</ul>
    <details class="dados"><summary>Ver dados em tabela</summary>
      ${tabela([{ titulo: "Categoria", chave: "rotulo" }, { titulo: "Valor", chave: "valor", num: true }, ...(comPct ? [{ titulo: "%", chave: "pct", num: true }] : [])], dados.map((d) => ({ rotulo: d.rotulo, valor: num(d.valor, 1), pct: comPct ? `${pct(d.valor, soma)}%` : "" })))}
    </details>
  </figure>`;
}

/* --- Colunas empilhadas por período (jornada: commits por mês e por projeto) --- */
export function colunasEmpilhadas(periodos, series, { titulo } = {}) {
  const L = 960, H = 260, base = 220, esq = 34, dir = 8;
  const totais = periodos.map((_, i) => series.reduce((s, sr) => s + (sr.valores[i] || 0), 0));
  const max = Math.max(...totais, 1);
  const passo = max > 20 ? 10 : max > 8 ? 5 : 2;
  const topo = Math.ceil(max / passo) * passo;
  const y = (v) => base - (v / topo) * (base - 20);
  const largura = (L - esq - dir) / periodos.length;
  const grade = Array.from({ length: topo / passo + 1 }, (_, k) => k * passo).map((v) =>
    `<line class="grade" x1="${esq}" x2="${L - dir}" y1="${y(v)}" y2="${y(v)}"></line><text class="eixo" x="${esq - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  const colunas = periodos.map((p, i) => {
    let acumulado = 0;
    const x = esq + i * largura + largura * 0.15;
    const w = largura * 0.7;
    const blocos = series.map((sr) => {
      const v = sr.valores[i] || 0;
      if (!v) return "";
      const y1 = y(acumulado + v), h = y(acumulado) - y1;
      acumulado += v;
      return `<rect x="${x}" y="${y1}" width="${w}" height="${h}" fill="${sr.cor}"><title>${esc(sr.nome)} · ${data(p)}: ${v}</title></rect>`;
    }).join("");
    const mostraRotulo = i === 0 || p.endsWith("-01") || i === periodos.length - 1;
    const rotulo = mostraRotulo ? `<text class="eixo" x="${x + w / 2}" y="${base + 16}" text-anchor="middle">${data(p)}</text>` : "";
    return blocos + rotulo;
  }).join("");
  const legenda = series.map((s) => `<span><i style="background:${s.cor}"></i>${esc(s.nome)}</span>`).join("");
  const linhas = periodos.map((p, i) => ({ mes: data(p), ...Object.fromEntries(series.map((s) => [s.nome, s.valores[i] || 0])), total: totais[i] })).filter((l) => l.total);
  return `<figure>
    <svg class="grafico" viewBox="0 0 ${L} ${H}" role="img" aria-label="${esc(titulo || "Gráfico de colunas")}">${grade}${colunas}</svg>
    <div class="legenda">${legenda}</div>
    <details class="dados"><summary>Ver dados em tabela (meses com commits)</summary>
      ${tabela([{ titulo: "Mês", chave: "mes" }, ...series.map((s) => ({ titulo: s.nome, chave: s.nome, num: true })), { titulo: "Total", chave: "total", num: true }], linhas)}
    </details>
  </figure>`;
}

/* --- Peça do acervo (miniatura clicável) --- */
export function peca(item) {
  const thumb = item.mini || item.capa;
  const icone = { video: "bx-play-circle", codigo: "bx-code-alt", documento: "bx-file", planilha: "bx-spreadsheet", texto: "bx-text" }[item.formato] || "bx-image";
  return `<button class="peca" type="button" data-peca="${esc(item.id)}">
    <span class="peca-img">
      ${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" decoding="async" width="480" height="360" />` : `<i class="bx ${icone}" aria-hidden="true"></i><span class="peca-ext" aria-hidden="true">${esc((item.arquivo.split(".").pop() || "").toUpperCase())}</span>`}
      ${item.formato === "video" ? `<span class="play">▶ ${duracao(item.duracao_s)}</span>` : ""}
    </span>
    <span class="peca-info">
      <strong>${esc(item.titulo)}</strong>
      <span>${esc(ROTULOS.finalidade[item.finalidade] || item.finalidade)} · ${esc(item.colecao || ROTULOS.formato[item.formato])}</span>
    </span>
  </button>`;
}

/* --- Visualizador (lightbox) com <dialog> nativo: Esc fecha e o foco volta sozinho --- */
export async function abrirVisualizador(item) {
  const dialogo = document.getElementById("visualizador");
  let corpo;
  if (item.formato === "imagem") {
    corpo = `<img src="${esc(item.grande || item.arquivo)}" alt="${esc(item.titulo)}" />`;
  } else if (item.formato === "video") {
    corpo = item.youtube
      ? `<iframe width="960" height="540" src="https://www.youtube-nocookie.com/embed/${esc(item.youtube)}" title="${esc(item.titulo)}" allowfullscreen></iframe>`
      : `<video src="${esc(item.arquivo)}" ${item.capa ? `poster="${esc(item.capa)}"` : ""} controls preload="none"></video>`;
  } else if (item.formato === "codigo") {
    const texto = await fetch(item.arquivo).then((r) => r.text()).catch(() => "Não foi possível carregar o arquivo.");
    corpo = `<pre><code>${esc(texto)}</code></pre>`;
  } else {
    corpo = `<p>Pré-visualização indisponível para este formato.</p>`;
  }
  dialogo.innerHTML = `
    <div class="vis-topo">
      <div>
        <h2 id="vis-titulo">${esc(item.titulo)}</h2>
        ${item.resumo ? `<p>${esc(item.resumo)}</p>` : ""}
      </div>
      <button class="vis-fechar" type="button" aria-label="Fechar" data-fechar>&times;</button>
    </div>
    <div class="vis-corpo">${corpo}</div>
    <div class="vis-rodape">
      <span>${esc(ROTULOS.finalidade[item.finalidade])} · ${esc(ROTULOS.persona[item.persona])}</span>
      <span>Fonte: ${esc(item.fonte)}</span>
      <span title="Data do commit que adicionou o arquivo (git log)">No repositório desde ${data(item.data)}</span>
      ${item.largura ? `<span>${item.largura} × ${item.altura} px</span>` : ""}
      <span>Original: ${mb(item.bytes)}</span>
      <a class="btn btn-ghost btn-sm" href="${esc(item.arquivo)}" download><i class="bx bx-download" aria-hidden="true"></i> Baixar original</a>
    </div>`;
  dialogo.showModal();
}

export function ligarVisualizador() {
  const dialogo = document.getElementById("visualizador");
  dialogo.addEventListener("click", (e) => {
    if (e.target === dialogo || e.target.closest("[data-fechar]")) dialogo.close();
  });
  dialogo.addEventListener("close", () => {
    dialogo.querySelector("video")?.pause();
    dialogo.innerHTML = "";
  });
}
