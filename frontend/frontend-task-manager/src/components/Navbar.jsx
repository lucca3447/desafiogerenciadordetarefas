import { useAuth } from "../context/AuthContext";
import { LogOut, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Lado Esquerdo: Logo + Links de Navegação */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <CheckSquare size={28} className="text-primary-100" />
              <span className="font-bold text-xl tracking-tight">BrasilTarefas</span>
            </div>

            <div className="hidden md:flex gap-4">
              <Link to="/" className="text-primary-100 hover:text-white font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/tarefas" className="text-primary-100 hover:text-white font-medium transition-colors">
                Tarefas
              </Link>
            </div>
          </div>

          {/* Lado Direito: Usuário e Botão Sair */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-primary-100 hidden sm:block">
              Olá, <span className="font-semibold text-white">{user?.nome}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}