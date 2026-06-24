from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories.tarefa_repository import TarefaRepository
from schemas.tarefa_schema import TarefaCreate, TarefaUpdate, TarefaStatusUpdate
from services.historico_tarefa_service import HistoricoTarefaService
from models.usuario_model import Usuario

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
                detail="Tarefa não encontrada ou acesso negado."
            )
        return tarefa

    def criar_tarefa(self, tarefa_in: TarefaCreate, usuario: Usuario):
        if tarefa_in.data_limite and tarefa_in.data_limite.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A data limite não pode estar no passado."
            )
        return self.repository.criar(tarefa_in, usuario.id_usuario)

    def atualizar_tarefa(self, id_tarefa: int, tarefa_in: TarefaUpdate, usuario: Usuario):
        tarefa_db = self.buscar_tarefa_permitida(id_tarefa, usuario)
        
        if tarefa_in.status and tarefa_in.status != tarefa_db.status:
            self.historico_service.registrar(id_tarefa, usuario.id_usuario, "status", tarefa_db.status, tarefa_in.status)
        if tarefa_in.prioridade and tarefa_in.prioridade != tarefa_db.prioridade:
            self.historico_service.registrar(id_tarefa, usuario.id_usuario, "prioridade", tarefa_db.prioridade, tarefa_in.prioridade)
            
        return self.repository.atualizar(tarefa_db, tarefa_in)

    def alterar_status(self, id_tarefa: int, status_in: TarefaStatusUpdate, usuario: Usuario):
        tarefa_db = self.buscar_tarefa_permitida(id_tarefa, usuario)
        if tarefa_db.status == status_in.status:
            return tarefa_db
            
        self.historico_service.registrar(id_tarefa, usuario.id_usuario, "status", tarefa_db.status, status_in.status)
        
        tarefa_update = TarefaUpdate(status=status_in.status)
        tarefa_atualizada = self.repository.atualizar(tarefa_db, tarefa_update)
        
        if status_in.status == "concluida":
            tarefa_atualizada.completada_em = datetime.now(timezone.utc)
            self.repository.db.commit()
            
        return tarefa_atualizada

    def deletar_tarefa(self, id_tarefa: int, usuario: Usuario):
        tarefa_db = self.buscar_tarefa_permitida(id_tarefa, usuario)
        self.repository.deletar(tarefa_db)
