from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth_dependencies import get_current_user
from core.database import get_db
from models.usuario_model import Usuario
from schemas.historico_tarefa_schema import HistoricoTarefaResponse
from services.historico_tarefa_service import HistoricoTarefaService
from services.tarefa_service import TarefaService

router = APIRouter(prefix="/tarefas", tags=["Histórico de Tarefas"])

@router.get("/{id_tarefa}/historico", response_model=List[HistoricoTarefaResponse])
def listar_historico_tarefa(id_tarefa: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    # verifica se a tarefa pertence ao usuário logado, se pertencer lista o historico
    TarefaService(db).buscar_minha_tarefa(id_tarefa, current_user.id_usuario)

    service = HistoricoTarefaService(db)

    return service.listar_historico(id_tarefa)
