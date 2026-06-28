import { useAuth } from "../context/AuthContext";

export default function Dashboard() {

  const {user, logout} = useAuth();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800"> 
        Eai, {user?.nome}! </h1>
        
      {/* botao de logout */}
      <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
        Sair da conta
      </button>
    </div>
  );
}
