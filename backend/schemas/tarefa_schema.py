from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


StatusTarefa = Literal["pendente", "em_andamento", "concluida"]
PrioridadeTarefa = Literal["baixa", "media", "alta"]


class TarefaCreate(BaseModel):
    titulo: str = Field(min_length=2, max_length=120)
    descricao: str | None = Field(default=None, max_length=5000)
    status: StatusTarefa = "pendente"
    prioridade: PrioridadeTarefa = "media"
    responsavel: str | None = Field(default=None, max_length=100)
    data_limite: datetime | None = None


class TarefaUpdate(BaseModel):
    titulo: str | None = Field(default=None, min_length=2, max_length=120)
    descricao: str | None = Field(default=None, max_length=5000)
    status: StatusTarefa | None = None
    prioridade: PrioridadeTarefa | None = None
    responsavel: str | None = Field(default=None, max_length=100)
    data_limite: datetime | None = None


class TarefaStatusUpdate(BaseModel):
    status: StatusTarefa


class TarefaResponse(BaseModel):
    id_tarefa: int
    id_usuario: int
    titulo: str
    descricao: str | None
    status: str
    prioridade: str
    responsavel: str | None
    data_limite: datetime | None
    criada_em: datetime
    atualizada_em: datetime
    completada_em: datetime | None

    class Config:
        from_attributes = True