from sqlalchemy.orm import Session

from models.tarefa_model import Tarefa
from schemas.tarefa_schema import TarefaCreate, TarefaUpdate


class TarefaRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar_todas(self):
        return self.db.query(Tarefa).all()

    def listar_por_usuario(self, id_usuario: int):
        return self.db.query(Tarefa).filter(Tarefa.id_usuario == id_usuario).all()

    def buscar_qualquer_por_id(self, id_tarefa: int):
        return self.db.query(Tarefa).filter(Tarefa.id_tarefa == id_tarefa).first()

    def buscar_por_id(self, id_tarefa: int, id_usuario: int):
        return self.db.query(Tarefa).filter(
            Tarefa.id_tarefa == id_tarefa,
            Tarefa.id_usuario == id_usuario,
        ).first()

    def criar(self, tarefa: TarefaCreate, id_usuario: int):
        nova_tarefa = Tarefa(
            id_usuario=id_usuario,
            titulo=tarefa.titulo,
            descricao=tarefa.descricao,
            status=tarefa.status,
            prioridade=tarefa.prioridade,
            responsavel=tarefa.responsavel,
            data_limite=tarefa.data_limite,
        )
        self.db.add(nova_tarefa)
        self.db.commit()
        self.db.refresh(nova_tarefa)
        return nova_tarefa

    def atualizar(self, tarefa_db: Tarefa, tarefa: TarefaUpdate):
        if tarefa.titulo is not None:
            tarefa_db.titulo = tarefa.titulo
        if tarefa.descricao is not None:
            tarefa_db.descricao = tarefa.descricao
        if tarefa.status is not None:
            tarefa_db.status = tarefa.status
        if tarefa.prioridade is not None:
            tarefa_db.prioridade = tarefa.prioridade
        if tarefa.responsavel is not None:
            tarefa_db.responsavel = tarefa.responsavel
        if tarefa.data_limite is not None:
            tarefa_db.data_limite = tarefa.data_limite

        self.db.commit()
        self.db.refresh(tarefa_db)
        return tarefa_db

    def salvar(self, tarefa_db: Tarefa):
        self.db.commit()
        self.db.refresh(tarefa_db)
        return tarefa_db

    def deletar(self, tarefa_db: Tarefa):
        self.db.delete(tarefa_db)
        self.db.commit()
