from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class HistoricoTarefa(Base):
    __tablename__ = "historico_tarefa"

    id_historico_tarefa = Column(Integer, primary_key=True, index=True)
    id_tarefa = Column(Integer, ForeignKey("tarefas.id_tarefa"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    acao = Column(String(30), nullable=False)
    campo_alterado = Column(String(50), nullable=True)
    valor_antigo = Column(Text, nullable=True)
    valor_novo = Column(Text, nullable=True)
    criado_em = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    tarefa = relationship("Tarefa", back_populates="historicos")
    usuario = relationship("Usuario", back_populates="historicos")
