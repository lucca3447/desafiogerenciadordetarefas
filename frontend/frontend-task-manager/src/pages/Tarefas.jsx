import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Trash2, Pencil, History } from "lucide-react";
import ModalEditarTarefa from "../components/ModalEditarTarefa";
import ModalNovaTarefa from "../components/ModalNovaTarefa";
import ModalHistoricoTarefa from "../components/ModalHistoricoTarefa";


export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);

  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [tarefaHistorico, setTarefaHistorico] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [busca, setBusca] = useState("");           
  const [filtroStatus, setFiltroStatus] = useState("");      
  const [filtroPrioridade, setFiltroPrioridade] = useState(""); 
  const [filtroResponsavel, setFiltroResponsavel] = useState("");
  const [filtroDataLimite, setFiltroDataLimite] = useState("");

  const tarefasFiltradas = tarefas
  .filter((t) => 
    t.titulo.toLowerCase().includes(busca.toLowerCase()) || 
    (t.descricao && t.descricao.toLowerCase().includes(busca.toLowerCase()))
  )
  .filter((t) => (filtroStatus ? t.status === filtroStatus : true))
  .filter((t) => (filtroPrioridade ? t.prioridade === filtroPrioridade : true))
  .filter((t) => (filtroResponsavel ? (t.responsavel && t.responsavel.toLowerCase().includes(filtroResponsavel.toLowerCase())) : true))
  .filter((t) => (filtroDataLimite ? (t.data_limite && t.data_limite.startsWith(filtroDataLimite)) : true));


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

    const deletarTarefa = async (id_tarefa) => {
    const confirmou = window.confirm("Tem certeza que deseja excluir essa tarefa?");
    if (!confirmou) return;

    try {
        await api.delete(`/tarefas/${id_tarefa}`);
        //remove a tarefa da lista sem recarregar a pagina
         setTarefas((tarefasAtuais) =>
            tarefasAtuais.filter((t) => t.id_tarefa !== id_tarefa));
    } catch (erro) {
        alert("Não foi possível excluir a tarefa!");
    }
    };

  const coresStatus = {
    pendente:     "bg-yellow-100 text-yellow-700",
    em_andamento: "bg-blue-100 text-blue-700",
    concluida:    "bg-primary-100 text-primary-700",
  };

  const coresPrioridade = {
    alta:  "bg-red-100 text-red-700",
    media: "bg-orange-100 text-orange-700",
    baixa: "bg-gray-100 text-gray-600",
  };


  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col gap-4">
        {/* titulo e botao */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
            + Nova Tarefa
          </button>
        </div>

          {/*  barra de busca e filtros*/}
          <div className="flex flex-col sm:flex-row gap-3">
    
          {/* Barra de Busca */}
        <input
              type="text"
              placeholder="Buscar por título..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* Filtro de Status */}
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">Todos os Status</option>
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluida">Concluída</option>
        </select>

    {/* Filtro de Prioridade */}
    <select
      value={filtroPrioridade}
      onChange={(e) => setFiltroPrioridade(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
    >
      <option value="">Todas as Prioridades</option>
      <option value="alta">Alta</option>
      <option value="media">Média</option>
      <option value="baixa">Baixa</option>
    </select>

    <input
      type="text"
      placeholder="Responsável..."
      value={filtroResponsavel}
      onChange={(e) => setFiltroResponsavel(e.target.value)}
      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
    />

    <input
      type="date"
      value={filtroDataLimite}
      onChange={(e) => setFiltroDataLimite(e.target.value)}
      className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-500"
    />

  </div>
</div>


      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {tarefasFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma tarefa encontrada.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tarefasFiltradas.map((tarefa) => (
              <div key={tarefa.id_tarefa} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{tarefa.titulo}</h3>
                    {tarefa.data_limite && new Date(tarefa.data_limite) < new Date() && tarefa.status !== 'concluida' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold uppercase tracking-wider">
                        Atrasada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{tarefa.descricao}</p>
                  {tarefa.responsavel && (
                    <p className="text-xs text-gray-400 mt-2 font-medium">Resp: {tarefa.responsavel}</p>
                  )}
                </div>
                
                <div className="flex gap-2">

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${coresPrioridade[tarefa.prioridade]}`}>
                      {tarefa.prioridade}
                    </span>
                    
                    <select
                        value={tarefa.status}
                        onChange={(e) => alterarStatus(tarefa.id_tarefa, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${coresStatus[tarefa.status]}`}>
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                    </select>
                    <button
                        onClick={() => deletarTarefa(tarefa.id_tarefa)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                        <Trash2 size={18} />
                    </button>

                    <button
                        onClick={() => setTarefaEditando(tarefa)}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Editar Tarefa"
                        >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => setTarefaHistorico(tarefa.id_tarefa)}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Ver Histórico"
                        >
                        <History size={18} />
                    </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      {tarefaEditando && (
        <ModalEditarTarefa 
            tarefa={tarefaEditando} 
            onClose={() => setTarefaEditando(null)} 
            onTarefaEditada={() => {setTarefaEditando(null);
            window.location.reload();
        }}/>
        )}
        {isModalOpen && (
            <ModalNovaTarefa
            onClose={() => setIsModalOpen(false)}
            onTarefaCriada={() => {
            setIsModalOpen(false);
            window.location.reload();
            }}
        />
        )}
        
        {tarefaHistorico && (
            <ModalHistoricoTarefa
            id_tarefa={tarefaHistorico}
            onClose={() => setTarefaHistorico(null)}
            />
        )}
    </div>
  );
}