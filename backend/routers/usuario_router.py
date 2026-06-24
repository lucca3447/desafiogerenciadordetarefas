from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from core.auth_dependencies import get_current_user
from core.database import get_db
from models.usuario_model import Usuario
from schemas.usuario_schema import UsuarioCreate, UsuarioResponse
from services.usuario_service import UsuarioService

router = APIRouter(prefix="/auth", tags=["Autenticação e Usuários"])


@router.post("/registrar", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    service = UsuarioService(db)
    return service.registrar_usuario(usuario)


@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # O OAuth2PasswordRequestForm usa username por padrão, coloquei para ser email
    service = UsuarioService(db)
    return service.autenticar_usuario(email=form_data.username, senha_plana=form_data.password)


@router.get("/me", response_model=UsuarioResponse)
def get_me(current_user: Usuario = Depends(get_current_user)):
    return current_user
