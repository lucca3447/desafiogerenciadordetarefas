from sqlalchemy.orm import Session
from repositories.historico_tarefa_repository import HistoricoTarefaRepository

class HistoricoTarefaService:
    def __init__(self, db: Session):
        self.repository = HistoricoTarefaRepository(db)

    def listar_historico(self, id_tarefa: int):
        return self.repository.listar_por_tarefa(id_tarefa)

    def registrar(self, id_tarefa: int, id_usuario: int, acao: str, campo_alterado: str, valor_antigo: str, valor_novo: str):
        return self.repository.registrar_mudanca(
            id_tarefa=id_tarefa,
            id_usuario=id_usuario,
            acao=acao,
            campo_alterado=campo_alterado,
            valor_antigo=str(valor_antigo) if valor_antigo is not None else "",
            valor_novo=str(valor_novo) if valor_novo is not None else "")
