import api from "./api";

export const getRelatorios = () =>
  api.get("/api/relatorios").then((r) => r.data);

export const getRelatorio = (id) =>
  api.get(`/api/relatorios/${id}`).then((r) => r.data);

// Quando a API key da IA estiver pronta, a geração passará por aqui
export const createRelatorio = (dados) =>
  api.post("/api/relatorios", dados).then((r) => r.data);