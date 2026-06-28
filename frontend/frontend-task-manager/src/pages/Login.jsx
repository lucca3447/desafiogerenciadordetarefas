import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (evento) => {
    evento.preventDefault();

    try {
      await login(email,password);
      navigate("/")
    }catch (err){
      alert("E-mail ou senha incorretos!")
    }
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6"> Entrar na sua conta</h2>
        <p className="text-center text-sm text-gray-600 mb-6"> Não possui uma conta? {""}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline"> Clique aqui</Link> para criar uma
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* div do email*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email}
            onChange={(evento) => setEmail(evento.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500" 
            placeholder="ex: neymar10@gmail.com" required 
            />
          </div>
          {/* div da senha*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={password}
            onChange={(evento) => setPassword(evento.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500" 
            placeholder="*****" required 
            />
          </div>
          {/* botao de entrar*/}
          <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"> Entrar</button>
        </form>
      </div>
        
    </div>
  );
}
