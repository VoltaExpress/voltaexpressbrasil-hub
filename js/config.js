/**
 * Hub Volta Express — configuração e rótulos.
 * Os DADOS não ficam aqui: vêm de data/*.json, gerados pelos scripts em scripts/.
 */
export const CONFIG = {
  versao: "7.0.0",
  pastaDados: "./data/",
  porPagina: 48, // peças por "carregar mais" no acervo
};

export const ROTULOS = {
  finalidade: {
    relatorio: "Relatório",
    dashboard: "Dashboard",
    demonstracao: "Demonstração",
    pesquisa: "Pesquisa e referências",
    analise: "Análise",
    explicacao: "Explicação",
    marca: "Marca",
  },
  formato: { imagem: "Imagem", video: "Vídeo", codigo: "Código", documento: "Documento", planilha: "Planilha", texto: "Texto" },
  persona: { caminhoneiro: "Caminhoneiro", embarcador: "Embarcador", institucional: "Institucional" },
  tipoRelatorio: { relatorio: "Relatório", analise: "Análise", explicacao: "Explicação" },
};

/** Cores por projeto (mesmas cores da marca; contraste verificado contra branco). */
export const CORES_PROJETO = {
  landing: { cor: "#fe5b3d", nome: "Landing" },
  plataforma: { cor: "#104ac8", nome: "Plataforma" },
  hub: { cor: "#15803d", nome: "Hub" },
};

/** Paleta oficial — espelha shared/tokens.css (landing v7). */
export const PALETA = [
  { nome: "Azul institucional", token: "--color-primary", hex: "#104ac8", uso: "Botões principais e links", contraste: "7,41:1 com branco" },
  { nome: "Laranja da marca", token: "--color-brand", hex: "#fe5b3d", uso: "Fundos, ícones e faixas", contraste: "3,1:1 — não usar em texto pequeno" },
  { nome: "Laranja de destaque", token: "--color-brand-strong", hex: "#ee4f2c", uso: "Palavras destacadas em títulos grandes", contraste: "3,2:1 no fundo do hero" },
  { nome: "Laranja para texto", token: "--color-brand-text", hex: "#c2410c", uso: "Textos pequenos em laranja", contraste: "5,18:1 com branco" },
  { nome: "Verde WhatsApp", token: "--color-whatsapp", hex: "#15803d", uso: "Botões de contato", contraste: "5,02:1 com branco" },
  { nome: "Grafite", token: "--color-text", hex: "#1e293b", uso: "Texto principal e fundos escuros", contraste: "14,6:1 com branco" },
  { nome: "Cinza texto", token: "--color-text-muted", hex: "#475569", uso: "Texto secundário", contraste: "7,58:1 com branco" },
  { nome: "Fundo suave", token: "--color-bg-soft", hex: "#f8fafc", uso: "Fundos de seção", contraste: "—" },
];
