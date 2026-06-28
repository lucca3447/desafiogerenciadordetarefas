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
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">
                    {tarefa.status}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}