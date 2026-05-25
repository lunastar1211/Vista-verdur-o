import api from "./api";

// Usuários
export const getUsuarios = () =>
  api.get("/api/usuarios").then((r) => r.data);

export const getUsuario = (id) =>
  api.get(`/api/usuarios/${id}`).then((r) => r.data);

export const createUsuario = (dados) =>
  api.post("/api/usuarios", dados).then((r) => r.data);

export const updateUsuario = (id, dados) =>
  api.put(`/api/usuarios/${id}`, dados).then((r) => r.data);

// Base de conhecimento
export const getConhecimento = () =>
  api.get("/api/conhecimento").then((r) => r.data);

export const createConhecimento = (dados) =>
  api.post("/api/conhecimento", dados).then((r) => r.data);

export const updateConhecimento = (id, dados) =>
  api.put(`/api/conhecimento/${id}`, dados).then((r) => r.data);

export const deleteConhecimento = (id) =>
  api.delete(`/api/conhecimento/${id}`).then((r) => r.data);