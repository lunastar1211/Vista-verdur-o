const axios = require("axios");

const TOTVS_BASE = process.env.TOTVS_URL || "https://www30.bhan.com.br:9443";
const TOTVS_TOKEN = process.env.TOTVS_TOKEN;

// Instância axios com autenticação Bearer
const totvs = axios.create({
  baseURL: TOTVS_BASE,
  headers: {
    "Authorization": `Bearer ${TOTVS_TOKEN}`,
    "Content-Type": "application/json",
  },
  // Ignora erros de certificado SSL (comum em servidores internos)
  httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
});

// ── Buscar produtos ───────────────────────────────────────────
async function buscarProdutos(pagina = 0, tamanhoPagina = 100) {
  const body = {
    filter: {
      branchInfo: { branchCode: 0, isActive: true },
    },
    page: pagina,
    pageSize: tamanhoPagina,
  };

  const { data } = await totvs.post(
    "/api/totvsmoda/product/v2/products/search",
    body
  );
  return data;
}

// ── Buscar saldos/estoque ─────────────────────────────────────
async function buscarSaldos(pagina = 0, tamanhoPagina = 100) {
  const body = {
    filter: {},
    page: pagina,
    pageSize: tamanhoPagina,
  };

  const { data } = await totvs.post(
    "/api/totvsmoda/product/v2/balances/search",
    body
  );
  return data;
}

// ── Buscar preços ─────────────────────────────────────────────
async function buscarPrecos(pagina = 0, tamanhoPagina = 100) {
  const body = {
    filter: {},
    page: pagina,
    pageSize: tamanhoPagina,
  };

  const { data } = await totvs.post(
    "/api/totvsmoda/product/v2/prices/search",
    body
  );
  return data;
}

module.exports = { buscarProdutos, buscarSaldos, buscarPrecos };