import axios from "axios";


// Tenta pegar a URL do servidor de produção, se não achar usa o localhost
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", 
});

// interceptador: verifica token antes de qualquer requisição sair do frontend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
