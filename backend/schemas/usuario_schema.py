from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UsuarioCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=100)
    email: EmailStr = Field(max_length=150)
    senha: str = Field(min_length=8, max_length=100)


class UsuarioUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = Field(default=None, max_length=150)
    senha: str | None = Field(default=None, min_length=8, max_length=100)
    ativo: bool | None = None


class UsuarioResponse(BaseModel):
    id_usuario: int
    nome: str
    email: str
    ativo: bool
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        from_attributes = True