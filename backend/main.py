from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import Base, engine

from models.historico_tarefa_model import HistoricoTarefa
from models.tarefa_model import Tarefa
from models.usuario_model import Usuario
from routers import usuario_router, task_router, dashboard_router, historico_tarefa_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gerenciador de Tarefas",
    description="API do desafio tecnico da Brasil Software",
    version="1.0",
)

allowed_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"mensagem": "API do gerenciador de tarefas funcionando"}

app.include_router(usuario_router.router)
app.include_router(task_router.router)
app.include_router(dashboard_router.router)
app.include_router(historico_tarefa_router.router)
