import { useAuth } from "../context/AuthContext";
import { LogOut, CheckSquare } from "lucide-react"; // Nossos ícones!
export default function Navbar() {
  
  const { user, logout } = useAuth();
  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* logo  na esquerda */}
          <div className="flex items-center gap-2">
            <CheckSquare size={28} className="text-primary-100" />
            <span className="font-bold text-xl tracking-tight">BrasilTarefas</span>
          </div>
          {/*usuario e botão sair na direita */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-primary-100 hidden sm:block">
              Olá, <span className="font-semibold text-white">{user?.nome}</span>
            </div>
            
            {/* botao que chama o logout*/}
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