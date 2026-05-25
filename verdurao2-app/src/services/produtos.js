import api from "./api";

export const getProdutos = () =>
  api.get("/api/produtos").then((r) => r.data);

export const getProduto = (sku) =>
  api.get(`/api/produtos/${sku}`).then((r) => r.data);

export const createProduto = (dados) =>
  api.post("/api/produtos", dados).then((r) => r.data);

export const updateProduto = (sku, dados) =>
  api.put(`/api/produtos/${sku}`, dados).then((r) => r.data);

export const deleteProduto = (sku) =>
  api.delete(`/api/produtos/${sku}`).then((r) => r.data);