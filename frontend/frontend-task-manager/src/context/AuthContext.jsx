import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assim que o app abre, verifica se o usuário já tem um token guardado
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Token inválido ou expirado", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    //  FastAPI com OAuth2 exige o formato 'application/x-www-form-urlencoded'
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/auth/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const token = response.data.access_token;
    localStorage.setItem("token", token);
    
    //busca os dados do usuário usando o novo token
    const userResponse = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(userResponse.data);
  };

  const register = async (nome, email, senha) => {
    await api.post("/auth/registrar", {
      nome,
      email,
      senha,
    });
    // Se o cadastro der certo, já fazemos o login automaticamente!
    await login(email, senha);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // aparece enquanto checa o login do usuario
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
