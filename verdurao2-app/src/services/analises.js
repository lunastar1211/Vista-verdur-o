import api from "./api";

export const getProdutosParados    = () => api.get("/api/analises/produtos-parados").then(r => r.data);
export const getGiroEstoque        = () => api.get("/api/analises/giro-estoque").then(r => r.data);
export const getCurvaAbc           = () => api.get("/api/analises/curva-abc").then(r => r.data);
export const getSugestoesPendentes = () => api.get("/api/analises/sugestoes-pendentes").then(r => r.data);
export const gerarSugestoes        = (id_usuario) => api.post("/api/analises/gerar-sugestoes", { id_usuario }).then(r => r.data);
export const decidirSugestao       = (id, status, id_usuario) => api.patch(`/api/analises/sugestoes/${id}/decisao`, { status_decisao: status, id_usuario }).then(r => r.data);