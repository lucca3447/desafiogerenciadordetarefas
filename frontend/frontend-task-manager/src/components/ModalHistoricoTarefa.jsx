import { useEffect, useState } from "react";
import { X, History } from "lucide-react";
import { api } from "../services/api";



export default function ModalHistoricoTarefa({ id_tarefa, onClose }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  // busca o histórico na API assim que o modal abre
  useEffect(() => {
    const buscarHistorico = async () => {
      try {
        const resposta = await api.get(`/tarefas/${id_tarefa}/historico`);
        setHistorico(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar histórico:", erro);
      } finally {
        setLoading(false);
      }
    };
    buscarHistorico();
  }, [id_tarefa]);

  // função auxiliar para formatar a data
  const formatarData = (dataIso) => {
    return new Date(dataIso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative max-h-[80vh] flex flex-col">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <History className="text-primary-500" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Histórico de Alterações</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando histórico...</div>
        ) : (
          <div className="overflow-y-auto flex-1 pr-2 space-y-4">
            {historico.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma alteração registrada ainda.</p>
            ) : (
              historico.map((item) => (
                <div key={item.id_historico_tarefa} className="border-l-2 border-primary-300 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-800">
                    Ação: <span className="uppercase text-primary-600">{item.acao}</span>
                    {item.campo_alterado && ` (${item.campo_alterado}: ${item.valor_antigo} -> ${item.valor_novo})`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Em: {formatarData(item.criado_em)}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}