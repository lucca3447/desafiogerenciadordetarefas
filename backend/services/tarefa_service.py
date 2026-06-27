from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.usuario_model import Usuario
from repositories.tarefa_repository import TarefaRepository
from schemas.tarefa_schema import TarefaCreate, TarefaStatusUpdate, TarefaUpdate
from services.historico_tarefa_service import HistoricoTarefaService


class TarefaService:
    def __init__(self, db: Session):
        self.repository = TarefaRepository(db)
        self.historico_service = HistoricoTarefaService(db)

    def listar_tarefas_permitidas(self, usuario: Usuario):
        if usuario.perfil == "admin":
            return self.repository.listar_todas()
        return self.repository.listar_por_usuario(usuario.id_usuario)

    def buscar_tarefa_permitida(self, id_tarefa: int, usuario: Usuario):
        if usuario.perfil == "admin":
            tarefa = self.repository.buscar_qualquer_por_id(id_tarefa)
        else:
            tarefa = self.repository.buscar_por_id(id_tarefa, usuario.id_usuario)

        if not tarefa:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa nao encontrada ou acesso negado.",
            )
        return tarefa

    def criar_tarefa(self, tarefa_in: TarefaCreate, usuario: Usuario):
        if tarefa_in.data_limite and tarefa_in.data_limite.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A data limite nao pode estar no passado.",
            )
        tarefa = self.repository.criar(tarefa_in, usuario.id_usuario)
        self.historico_service.registrar(tarefa.id_tarefa, usuario.id_usuario, "criada", None, None, None)
        return tarefa

    def atualizar_tarefa(self, id_tarefa: int, tarefa_in: TarefaUpdate, usuario: Usuario):
        tarefa_db = self.buscar_tarefa_permitida(id_tarefa, usuario)

        if tarefa_in.status and tarefa_in.status != tarefa_db.status:
            self.historico_service.registrar(id_tarefa, usuario.id_usuario, "status_alterado", "status", tarefa_db.status, tarefa_in.status)
        if tarefa_in.prioridade and tarefa_in.prioridade != tarefa_db.prioridade:
            self.historico_service.registrar(id_tarefa, usuario.id_usuario, "atualizada", "prioridade", tarefa_db.prioridade, tarefa_in.prioridade)

        tarefa_atualizada = self.repository.atualizar(tarefa_db, tarefa_in)
        if tarefa_in.status is not None:
            tarefa_atualizada.completada_em = datetime.now(timezone.utc) if tarefa_in.status == "concluida" else None
            tarefa_atualizada = self.repository.salvar(tarefa_atualizada)
        return tarefa_atualizada

    def alterar_status(self, id_tarefa: int, status_in: TarefaStatusUpdate, usuario: Usuario):
        tarefa_db = self.buscar_tarefa_permitida(id_tarefa, usuario)
        if tarefa_db.status == status_in.status:
            return tarefa_db

        self.historico_service.registrar(id_tarefa, usuario.id_usuario, "status_alterado", "status", tarefa_db.status, status_in.status)

        tarefa_update = TarefaUpdate(status=status_in.status)
        tarefa_atualizada = self.repository.atualizar(tarefa_db, tarefa_update)
        tarefa_atualizada.completada_em = datetime.now(timezone.utc) if status_in.status == "concluida" else None
        return self.repository.salvar(tarefa_atualizada)

    def deletar_tarefa(self, id_tarefa: int, usuario: Usuario):
        tarefa_db = self.buscar_tarefa_permitida(id_tarefa, usuario)
        self.historico_service.registrar(id_tarefa, usuario.id_usuario, "excluida", None, None, None)
        self.repository.deletar(tarefa_db)
