from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth_dependencies import get_current_user
from core.database import get_db
from models.usuario_model import Usuario
from services.tarefa_service import TarefaService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
def obter_dashboard(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    tarefas = TarefaService(db).listar_tarefas_permitidas(current_user)
    agora = datetime.now(timezone.utc)

    pendentes = 0
    concluidas = 0
    atrasadas = 0

    for tarefa in tarefas:
        if tarefa.status == "concluida":
            concluidas += 1
        else:
            pendentes += 1
            if tarefa.data_limite and tarefa.data_limite.replace(tzinfo=timezone.utc) < agora:
                atrasadas += 1

    return {
        "pendentes": pendentes,
        "concluidas": concluidas,
        "atrasadas": atrasadas,
        "total": len(tarefas),
    }
