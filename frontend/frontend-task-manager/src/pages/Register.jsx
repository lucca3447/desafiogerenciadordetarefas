import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {register} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (evento) => {
        evento.preventDefault();
        setLoading(true);
         
        try {
            await register(nome, email, password); // chama o cadastro na API
            navigate("/"); // se funcionar vai pro Dashboard
        } catch (err) {
            alert("Erro ao criar conta. Verifique os dados!");
        } finally {
            setLoading(false);
        }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Nova Conta</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Já tem acesso?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-500 underline">
              Faça login
            </Link>
          </p>
        </div>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Cristiano Ronaldo dos Santos Aveiro"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors mt-4 shadow-md disabled:opacity-70"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>
      </div>
    </div>
  );

}