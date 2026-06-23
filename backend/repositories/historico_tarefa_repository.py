from sqlalchemy.orm import Session

from models.historico_tarefa_model import HistoricoTarefa


class HistoricoTarefaRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar_por_tarefa(self, id_tarefa: int):
        return self.db.query(HistoricoTarefa).filter(
            HistoricoTarefa.id_tarefa == id_tarefa
        ).order_by(HistoricoTarefa.criado_em.desc()).all()

    def registrar_mudanca(self, id_tarefa: int, id_usuario: int, campo_alterado: str, valor_antigo: str, valor_novo: str):
        novo_historico = HistoricoTarefa(
            id_tarefa=id_tarefa,
            id_usuario=id_usuario,
            campo_alterado=campo_alterado,
            valor_antigo=valor_antigo,
            valor_novo=valor_novo
        )
        self.db.add(novo_historico)
        self.db.commit()
        self.db.refresh(novo_historico)
        return novo_historico
