import { useEffect, useState } from "react";
import { api } from "../services/api";



export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);

  // Busca as tarefas assim que a página abre
  useEffect(() => {
    const buscarTarefas = async () => {
      try {
        const resposta = await api.get("/tarefas");
        setTarefas(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar tarefas", erro);
      }
    };
    buscarTarefas();
  }, []);
  
  const alterarStatus = async (id_tarefa, novoStatus) => {
    try {
    // Chama a rota PATCH do seu backend
        await api.patch(`/tarefas/${id_tarefa}/status`, { status: novoStatus });
    
    // Atualiza a lista na tela sem precisar recarregar a página
        setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) =>
            t.id_tarefa === id_tarefa ? { ...t, status: novoStatus } : t)
        );
    } catch (erro) {
        console.error("Erro ao alterar status:", erro);
        alert("Não foi possível alterar o status!");
        }
    };

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {tarefas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma tarefa encontrada.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tarefas.map((tarefa) => (
              <div key={tarefa.id_tarefa} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                
                <div>
                  <h3 className="font-semibold text-gray-800">{tarefa.titulo}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tarefa.descricao}</p>
                </div>
                
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium uppercase">
                    {tarefa.prioridade}
                    </span>
                    <select
                        value={tarefa.status}
                        onChange={(e) => alterarStatus(tarefa.id_tarefa, e.target.value)}
                        className="text-xs font-medium px-2 py-1 rounded-full border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                    </select>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}