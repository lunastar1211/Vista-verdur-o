import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request — aqui você vai adicionar a API key da IA depois:
// api.defaults.headers.common["Authorization"] = `Bearer ${import.meta.env.VITE_AI_API_KEY}`;
api.interceptors.request.use(
  (config) => {
    // Exemplo futuro: injetar token de autenticação
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response — trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensagem =
      error.response?.data?.erro ||
      error.response?.data?.message ||
      "Erro inesperado. Tente novamente.";
    console.error(`[API Error] ${error.config?.url} →`, mensagem);
    return Promise.reject(new Error(mensagem));
  }
);

export default api;