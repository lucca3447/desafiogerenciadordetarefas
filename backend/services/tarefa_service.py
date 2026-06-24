from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories.tarefa_repository import TarefaRepository
from schemas.tarefa_schema import TarefaCreate, TarefaUpdate, TarefaStatusUpdate
from services.historico_tarefa_service import HistoricoTarefaService


class TarefaService:
    def __init__(self, db: Session):
        self.repository = TarefaRepository(db)
        self.historico_service = HistoricoTarefaService(db)

    def listar_minhas_tarefas(self, id_usuario: int):
        return self.repository.listar_por_usuario(id_usuario)

    def buscar_minha_tarefa(self, id_tarefa: int, id_usuario: int):
        tarefa = self.repository.buscar_por_id(id_tarefa, id_usuario)
        if not tarefa:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail="Tarefa não encontrada ou acesso negado."
            )
        return tarefa

    def criar_tarefa(self, tarefa_in: TarefaCreate, id_usuario: int):
        # Validação básica de data
        if tarefa_in.data_limite and tarefa_in.data_limite.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="A data limite não pode estar no passado."
            )
        return self.repository.criar(tarefa_in, id_usuario)

    def atualizar_tarefa(self, id_tarefa: int, tarefa_in: TarefaUpdate, id_usuario: int):
        tarefa_db = self.buscar_minha_tarefa(id_tarefa, id_usuario)
        
        if tarefa_in.status and tarefa_in.status != tarefa_db.status:
            self.historico_service.registrar(id_tarefa, id_usuario, "status", tarefa_db.status, tarefa_in.status)
        if tarefa_in.prioridade and tarefa_in.prioridade != tarefa_db.prioridade:
            self.historico_service.registrar(id_tarefa, id_usuario, "prioridade", tarefa_db.prioridade, tarefa_in.prioridade)
            
        return self.repository.atualizar(tarefa_db, tarefa_in)

    def alterar_status(self, id_tarefa: int, status_in: TarefaStatusUpdate, id_usuario: int):
        tarefa_db = self.buscar_minha_tarefa(id_tarefa, id_usuario)
        if tarefa_db.status == status_in.status:
            return tarefa_db
            
        self.historico_service.registrar(id_tarefa, id_usuario, "status", tarefa_db.status, status_in.status)
        
        tarefa_update = TarefaUpdate(status=status_in.status)
        tarefa_atualizada = self.repository.atualizar(tarefa_db, tarefa_update)
        
        if status_in.status == "concluida":
            tarefa_atualizada.completada_em = datetime.now(timezone.utc)
            self.repository.db.commit()
            
        return tarefa_atualizada

    def deletar_tarefa(self, id_tarefa: int, id_usuario: int):
        tarefa_db = self.buscar_minha_tarefa(id_tarefa, id_usuario)
        self.repository.deletar(tarefa_db)
