from typing import List

from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from core.auth_dependencies import require_admin
from core.database import get_db
from models.usuario_model import Usuario
from schemas.usuario_schema import UsuarioCreate, UsuarioResponse
from services.usuario_service import UsuarioService

router = APIRouter(prefix="/admin", tags=["Administrador"])


@router.post("/bootstrap-admin", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def bootstrap_admin(
    usuario: UsuarioCreate,
    db: Session = Depends(get_db),
    setup_key: str | None = Header(default=None, alias="X-Setup-Key"),
):
    service = UsuarioService(db)
    return service.registrar_admin(usuario, setup_key)


@router.get("/users", response_model=List[UsuarioResponse])
def listar_todos_usuarios(
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin),
):
    service = UsuarioService(db)
    return service.listar_todos()
