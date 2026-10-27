/**
 * Hub Volta Express — acesso aos dados.
 * Cada arquivo de data/ é baixado uma vez e reaproveitado (cache em memória).
 * Antes (v6), o catálogo ficava escrito à mão neste arquivo; agora é gerado por scripts/gerar_catalogo.py.
 */
import { CONFIG } from "./config.js";

const cache = new Map();

/** Carrega data/<nome>.json. */
export function carregar(nome) {
  if (!cache.has(nome)) {
    cache.set(nome, fetch(`${CONFIG.pastaDados}${nome}.json`, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(`Não foi possível carregar data/${nome}.json (${r.status})`);
      return r.json();
    }));
  }
  return cache.get(nome);
}

/** Carrega um fragmento HTML de relatório (data/relatorios/<id>.html). */
export function carregarTexto(caminho) {
  const chave = `texto:${caminho}`;
  if (!cache.has(chave)) {
    cache.set(chave, fetch(caminho).then((r) => {
      if (!r.ok) throw new Error(`Não foi possível carregar ${caminho}`);
      return r.text();
    }));
  }
  return cache.get(chave);
}

/** Materiais únicos do catálogo (sem os duplicados detectados por hash). */
export async function materiais() {
  const { itens } = await carregar("conteudo");
  return itens.filter((i) => !i.duplicado_de);
}
