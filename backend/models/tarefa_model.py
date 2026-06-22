from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Tarefa(Base):
    __tablename__ = "tarefas"

    id_tarefa = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    titulo = Column(String(120), nullable=False)
    descricao = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="pendente")
    prioridade = Column(String(20), nullable=False, default="media")
    responsavel = Column(String(100), nullable=True)
    data_limite = Column(DateTime(timezone=True), nullable=True)
    criada_em = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    atualizada_em = Column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )
    completada_em = Column(DateTime(timezone=True), nullable=True)

    usuario = relationship("Usuario", back_populates="tarefas")

    historicos = relationship(
        "HistoricoTarefa",
        back_populates="tarefa",
        cascade="all, delete-orphan",
    )
