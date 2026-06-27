from sqlalchemy.orm import Session

from models.usuario_model import Usuario
from schemas.usuario_schema import UsuarioCreate, UsuarioUpdate


class UsuarioRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(self):
        return self.db.query(Usuario).all()

    def buscar_por_id(self, id_usuario: int):
        return self.db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()

    def buscar_por_email(self, email: str):
        return self.db.query(Usuario).filter(Usuario.email == email).first()

    def existe_admin(self):
        return self.db.query(Usuario).filter(Usuario.perfil == "admin").first() is not None

    def criar(self, usuario: UsuarioCreate, senha_hash: str):
        novo_usuario = Usuario(
            nome=usuario.nome,
            email=usuario.email,
            senha_hash=senha_hash,
        )
        self.db.add(novo_usuario)
        self.db.commit()
        self.db.refresh(novo_usuario)
        return novo_usuario

    def criar_admin(self, usuario: UsuarioCreate, senha_hash: str):
        novo_admin = Usuario(
            nome=usuario.nome,
            email=usuario.email,
            senha_hash=senha_hash,
            perfil="admin",
        )
        self.db.add(novo_admin)
        self.db.commit()
        self.db.refresh(novo_admin)
        return novo_admin

    def atualizar(self, usuario_db: Usuario, usuario: UsuarioUpdate, senha_hash: str | None = None):
        if usuario.nome is not None:
            usuario_db.nome = usuario.nome
        if usuario.email is not None:
            usuario_db.email = usuario.email
        if usuario.ativo is not None:
            usuario_db.ativo = usuario.ativo
        if senha_hash:
            usuario_db.senha_hash = senha_hash

        self.db.commit()
        self.db.refresh(usuario_db)
        return usuario_db

    def deletar(self, usuario: Usuario):
        self.db.delete(usuario)
        self.db.commit()
