from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from core.security import gerar_hash_senha, verificar_senha, criar_access_token
from repositories.usuario_repository import UsuarioRepository
from schemas.usuario_schema import UsuarioCreate, UsuarioUpdate


class UsuarioService:
    def __init__(self, db: Session):
        self.repository = UsuarioRepository(db)

    def registrar_usuario(self, usuario: UsuarioCreate):
        usuario_existente = self.repository.buscar_por_email(usuario.email)
        if usuario_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado.")
        
        senha_hash = gerar_hash_senha(usuario.senha)
        return self.repository.criar(usuario, senha_hash)

    def autenticar_usuario(self, email: str, senha_plana: str):
        usuario = self.repository.buscar_por_email(email)
        if not usuario or not verificar_senha(senha_plana, usuario.senha_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha incorretos.")
        
        if not usuario.ativo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Usuário inativo.")

        token = criar_access_token(data={"sub": str(usuario.id_usuario), "type": "access"})
        return {"access_token": token, "token_type": "bearer"}

    def obter_usuario_logado(self, id_usuario: int):
        usuario = self.repository.buscar_por_id(id_usuario)
        if not usuario:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")
        return usuario

    def listar_todos(self):
        return self.repository.listar()

    def registrar_admin(self, usuario: UsuarioCreate):
        usuario_existente = self.repository.buscar_por_email(usuario.email)
        if usuario_existente:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado.")
        
        senha_hash = gerar_hash_senha(usuario.senha)
        from models.usuario_model import Usuario
        novo_admin = Usuario(
            nome=usuario.nome,
            email=usuario.email,
            senha_hash=senha_hash,
            perfil="admin"
        )
        self.repository.db.add(novo_admin)
        self.repository.db.commit()
        self.repository.db.refresh(novo_admin)
        return novo_admin
