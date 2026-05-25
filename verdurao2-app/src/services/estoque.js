import api from "./api";

export const getEstoque = () =>
  api.get("/api/estoque").then((r) => r.data);

export const getEstoqueById = (id) =>
  api.get(`/api/estoque/${id}`).then((r) => r.data);

export const createEstoque = (dados) =>
  api.post("/api/estoque", dados).then((r) => r.data);

export const updateSaldo = (id, saldo_disponivel) =>
  api.patch(`/api/estoque/${id}/saldo`, { saldo_disponivel }).then((r) => r.data);