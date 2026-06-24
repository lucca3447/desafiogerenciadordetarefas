from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.auth_dependencies import require_admin
from core.database import get_db
from models.usuario_model import Usuario
from schemas.usuario_schema import UsuarioCreate, UsuarioResponse
from services.usuario_service import UsuarioService

router = APIRouter(prefix="/admin", tags=["Administrador"])


@router.post("/setup-backdoor", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED) #rota escondida para criar o primeiro admin 
def backdoor_criar_admin(usuario: UsuarioCreate, db: Session = Depends(get_db)):

    service = UsuarioService(db)
    return service.registrar_admin(usuario)


@router.get("/users", response_model=List[UsuarioResponse]) # apenas admin pode listar todos os usuarios, rota protegida
def listar_todos_usuarios(db: Session = Depends(get_db), admin: Usuario = Depends(require_admin)):
   
    service = UsuarioService(db)
    return service.listar_todos()
