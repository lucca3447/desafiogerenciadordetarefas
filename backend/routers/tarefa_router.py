from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.auth_dependencies import get_current_user
from core.database import get_db
from models.usuario_model import Usuario
from schemas.tarefa_schema import TarefaCreate, TarefaResponse, TarefaStatusUpdate, TarefaUpdate
from services.tarefa_service import TarefaService

router = APIRouter(prefix="/tarefas", tags=["Tarefas"])


@router.get("", response_model=List[TarefaResponse])
def listar_tarefas(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    service = TarefaService(db)
    return service.listar_minhas_tarefas(current_user.id_usuario)


@router.post("", response_model=TarefaResponse, status_code=status.HTTP_201_CREATED)
def criar_tarefa(tarefa: TarefaCreate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    service = TarefaService(db)
    return service.criar_tarefa(tarefa, current_user.id_usuario)


@router.get("/{id_tarefa}", response_model=TarefaResponse)
def buscar_tarefa(id_tarefa: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    service = TarefaService(db)
    return service.buscar_minha_tarefa(id_tarefa, current_user.id_usuario)


@router.put("/{id_tarefa}", response_model=TarefaResponse)
def atualizar_tarefa(id_tarefa: int, tarefa: TarefaUpdate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    service = TarefaService(db)
    return service.atualizar_tarefa(id_tarefa, tarefa, current_user.id_usuario)


@router.patch("/{id_tarefa}/status", response_model=TarefaResponse)
def alterar_status_tarefa(id_tarefa: int, status_update: TarefaStatusUpdate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    service = TarefaService(db)
    return service.alterar_status(id_tarefa, status_update, current_user.id_usuario)


@router.delete("/{id_tarefa}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_tarefa(id_tarefa: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    service = TarefaService(db)
    service.deletar_tarefa(id_tarefa, current_user.id_usuario)
    return None
