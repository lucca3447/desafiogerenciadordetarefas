import { useState } from "react";
import { X } from "lucide-react";
import { api } from "../services/api";

export default function ModalNovaTarefa({ onClose, onTarefaCriada }) {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [dataLimite, setDataLimite] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/tarefas", { 
        titulo, 
        descricao,
        responsavel,
        prioridade,
        data_limite: dataLimite ? new Date(dataLimite).toISOString() : null
      });
      //  o envio dos dados der  certo, chamama a função q para avisar do sucesso
      onTarefaCriada();
      
      onClose();
    } catch (err) {
      const mensagemDeErro = err.response?.data?.detail || "Erro ao criar a tarefa!";
      alert(mensagemDeErro);
    } finally {
      setLoading(false);
    }
  };
  return (
    // fundo escuro transparente cobrindo a tela toda 
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      
      {/* caixa branca do Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
        
        {/* botão de Fechar no canto superior */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Nova Tarefa</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Ex: Revisar relatório financeiro"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder="Detalhes da tarefa..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Nome do responsável"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Limite</label>
              <input
                type="date"
                value={dataLimite}
                onChange={(e) => setDataLimite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-70"
            >
              {loading ? "Salvando..." : "Salvar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}