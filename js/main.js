/**
 * Hub Volta Express — ponto de entrada.
 * Roteador por hash (#/secao): funciona no GitHub Pages sem configuração de servidor,
 * e cada seção tem um link próprio que pode ser compartilhado.
 */
import { carregar } from "./data.js";
import { abrirVisualizador, ligarVisualizador } from "./renderers.js";
import * as secoes from "./ui.js";

const ROTAS = {
  "": { nome: "visao-geral", titulo: "Visão geral", render: secoes.visaoGeral },
  relatorios: { nome: "relatorios", titulo: "Relatórios", render: secoes.relatorios },
  pesquisa: { nome: "pesquisa", titulo: "Pesquisa", render: secoes.pesquisa },
  demonstracoes: { nome: "demonstracoes", titulo: "Demonstrações", render: secoes.demonstracoes },
  explicacoes: { nome: "explicacoes", titulo: "Explicações", render: secoes.explicacoes },
  jornada: { nome: "jornada", titulo: "Jornada", render: secoes.jornada },
  marca: { nome: "marca", titulo: "Marca", render: secoes.marca },
  acervo: { nome: "acervo", titulo: "Acervo", render: secoes.acervo },
};

/** "#/relatorios/plataforma-match" → { secao: "relatorios", id: "plataforma-match", parametros } */
function lerHash() {
  const [caminho, consulta = ""] = location.hash.replace(/^#\/?/, "").split("?");
  const [secao = "", id = ""] = caminho.split("/");
  return { secao, id: decodeURIComponent(id), parametros: new URLSearchParams(consulta) };
}

let rotaAnterior = null;

async function navegar() {
  const app = document.getElementById("app");
  const { secao, id, parametros } = lerHash();
  const rota = ROTAS[secao] || ROTAS[""];
  const primeiraCarga = rotaAnterior === null;
  const mudouDeSecao = rotaAnterior !== `${secao}/${id}`;
  rotaAnterior = `${secao}/${id}`;

  document.querySelectorAll(".hub-tabs a").forEach((a) => {
    if (a.dataset.rota === rota.nome) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = `${rota.titulo} | Hub Volta Express`;

  try {
    await rota.render(app, rota.nome === "acervo" ? parametros : id);
  } catch (erro) {
    console.error(erro);
    const viaArquivo = location.protocol === "file:";
    app.innerHTML = `<div class="aviso"><i class="bx bx-error-circle" aria-hidden="true"></i><span>
      Não foi possível carregar os dados desta seção. ${viaArquivo
        ? "Abra o Hub por um servidor local: na pasta do projeto, rode <code>python scripts/servir.py</code> e acesse <code>http://localhost:8080</code>."
        : `Detalhe: ${String(erro.message).replace(/[<>]/g, "")}`}
    </span></div>`;
  }
  // Ao trocar de seção, o foco vai para o conteúdo (leitor de tela anuncia a nova página).
  // Na primeira carga não: o Tab deve começar pelo "Pular para o conteúdo" e pelo menu.
  if (mudouDeSecao && !primeiraCarga) {
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
}

/* Abre qualquer material do catálogo pelo id (inclusive cópias idênticas). */
document.addEventListener("click", async (e) => {
  const botao = e.target.closest("[data-peca]");
  if (!botao) return;
  const { itens } = await carregar("conteudo");
  const item = itens.find((i) => i.id === botao.dataset.peca);
  if (item) abrirVisualizador(item);
});

document.getElementById("imprimir")?.addEventListener("click", () => window.print());
ligarVisualizador();
window.addEventListener("hashchange", navegar);
navegar();
