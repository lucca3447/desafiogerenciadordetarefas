import axios from "axios";


// Url local por enquanto
export const api = axios.create({
  baseURL: "http://localhost:8000", 
});

// interceptador: verifica token antes de qualquer requisição sair do frontend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
