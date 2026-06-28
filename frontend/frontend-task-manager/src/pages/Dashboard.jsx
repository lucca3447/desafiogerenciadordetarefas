import { useAuth } from "../context/AuthContext";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {

  const {user, logout} = useAuth();

  //para testar
  const metricas = {
    pendentes: 5,
    concluidas: 12,
    atrasadas: 2
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className=" text-2xl font-bold text-gray-800">Dashboard</h1>
          <p>Acompanhe o andamento das suas tarefas, {user?.nome}.</p>
        </div>
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Adicionar nova tarefa
        </button>
      </div>
       {/*Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          
          {/* card de tarefas Pendentes */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 border-l-4 border-yellow-400">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
              <Clock size={24} />
            </div>
            <div>
              <p className=" text-sm font-medium text-black">Tarefas pendentes</p>
              <h3 className="text-2xl font-bold text-black"> {metricas.pendentes} </h3>
            </div>
          </div>

          {/* Card de  tarefas concluidas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 border-l-4 border-green-400">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className=" text-sm font-medium text-black">Tarefas concluidas</p>
              <h3 className="text-2xl font-bold text-black"> {metricas.concluidas} </h3>
            </div>
          </div>
          {/* Card: Tarefas Atrasadas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 border-l-4 border-red-400">
            <div className="p-3 bg-red-50 text-red-600 rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className=" text-sm font-medium text-black">Tarefas Atrasadas</p>
              <h3 className="text-2xl font-bold text-black"> {metricas.atrasadas} </h3>
            </div>
          </div>
       </div>
    </div>
  );
}
