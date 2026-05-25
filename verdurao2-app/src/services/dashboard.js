import api from "./api";

export const getDashboardResumo = () =>
  api.get("/api/dashboard/resumo").then((r) => r.data);