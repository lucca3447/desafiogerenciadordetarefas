from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


AcaoHistorico = Literal["criada","atualizada","status_alterado","excluida"]


class HistoricoTarefaCreate(BaseModel):
    id_tarefa: int
    id_usuario: int
    acao: AcaoHistorico
    campo_alterado: str | None = Field(default=None, max_length=50)
    valor_antigo: str | None = None
    valor_novo: str | None = None


class HistoricoTarefaResponse(BaseModel):
    id_historico_tarefa: int
    id_tarefa: int
    id_usuario: int
    acao: str
    campo_alterado: str | None
    valor_antigo: str | None
    valor_novo: str | None
    criado_em: datetime

    class Config:
        from_attributes = True