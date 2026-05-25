import api from "./api";

export const getVendas = () =>
  api.get("/api/vendas").then((r) => r.data);

export const getVenda = (id) =>
  api.get(`/api/vendas/${id}`).then((r) => r.data);

export const createVenda = (dados) =>
  api.post("/api/vendas", dados).then((r) => r.data);

export const updateStatusVenda = (id, status) =>
  api.put(`/api/vendas/${id}/status`, { status }).then((r) => r.data);

export const getVendasStats = () =>
  api.get("/api/vendas/stats").then((r) => r.data);