from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth_dependencies import get_current_user
from core.database import get_db
from models.usuario_model import Usuario
from schemas.historico_tarefa_schema import HistoricoTarefaResponse
from services.historico_tarefa_service import HistoricoTarefaService
from services.tarefa_service import TarefaService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
def obter_dashboard(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    tarefas = TarefaService(db).listar_minhas_tarefas(current_user.id_usuario)
    
    agora = datetime.now(timezone.utc)
    
    pendentes = 0
    concluidas = 0
    atrasadas = 0
    
    for t in tarefas:
        if t.status == "concluida":
            concluidas += 1
        else:
            pendentes += 1
            if t.data_limite and t.data_limite.replace(tzinfo=timezone.utc) < agora:
                atrasadas += 1
                
    return {
        "pendentes": pendentes,
        "concluidas": concluidas,
        "atrasadas": atrasadas,
        "total": len(tarefas)
    }
