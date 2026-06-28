# Sistema de Gerenciamento de Tarefas

Este repositório contém um Sistema de Gerenciamento de Tarefas completo, construído com uma arquitetura dividida entre Backend (API) e Frontend (Aplicação Web).

## Arquitetura do Projeto

O projeto está dividido em duas pastas principais:

- `/backend` - API RESTful desenvolvida em Python (FastAPI).
- `/frontend` - Aplicação Web desenvolvida em React.

---

## Backend (API)

A API fornece os endpoints necessários para autenticação de usuários, gerenciamento de tarefas, dashboard e histórico de alterações.

### Arquitetura do Backend (Padrão em Camadas)

O backend foi desenhado utilizando arquitetura em camadas. O projeto está estruturado nas seguintes camadas:

- **Routers (Controllers):** recebem as requisições HTTP, acionam os services e devolvem as respostas.
- **Services (Camada de Negócio):** concentram regras de negócio, validações e permissões de usuários.
- **Repositories (Acesso a Dados):** fazem as consultas e persistências no banco usando SQLAlchemy.
- **Models:** representam as tabelas do banco de dados.
- **Schemas:** definem os contratos de entrada e saída da API com Pydantic.
- **Core:** concentra configuração, conexão com banco, segurança e autenticação.

### Tecnologias do Backend

- **Python 3**
- **FastAPI**
- **SQLAlchemy**
- **MySQL (XAMPP)**
- **Pydantic**
- **JWT (`python-jose`)**
- **Hash de senha (`passlib` + `bcrypt`)**
- **Uvicorn**

### Funcionalidades da API

- Registro de usuários comuns.
- Login com JWT.
- Proteção de rotas com Bearer Token.
- Criação segura do primeiro administrador com chave de setup.
- CRUD de tarefas por usuário autenticado.
- Listagem de usuários protegida para administradores.
- Dashboard com indicadores de tarefas.
- Histórico de alterações de tarefas.

### Como rodar o Backend localmente

1. Entre na pasta do backend:

   ```bash
   cd backend
   ```

2. Crie e ative o ambiente virtual:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Instale as dependências:

   ```bash
   python -m pip install -r requirements.txt
   ```

4. Inicie o MySQL e crie o banco de dados:

   ```sql
   CREATE DATABASE taskmanager;
   ```

5. Crie um arquivo `.env` dentro da pasta `backend/` com base no `.env.example`:

   ```env
   DATABASE_URL=mysql+pymysql://root:@localhost:3306/brasilsoftware
   SECRET_KEY=troque_por_uma_chave_forte
   ADMIN_SETUP_KEY=troque_por_uma_chave_de_setup
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

6. Rode a API:

   ```bash
   python -m uvicorn main:app --reload
   ```

A API ficará disponível em:

```txt
http://127.0.0.1:8000
```

A documentação interativa ficará disponível em:

```txt
http://127.0.0.1:8000/docs
```

### Criando o primeiro administrador

A rota de criação do primeiro administrador não aparece no Swagger por segurança. Ela deve ser chamada manualmente, por exemplo pelo Postman.

Endpoint:

```txt
POST http://127.0.0.1:8000/admin/bootstrap-admin
```

Header obrigatório:

```txt
X-Setup-Key: valor_do_ADMIN_SETUP_KEY
```

Body JSON:

```json
{
  "nome": "Admin",
  "email": "admin@email.com",
  "senha": "12345678"
}
```

A chave enviada em `X-Setup-Key` precisa ser igual ao valor configurado em `ADMIN_SETUP_KEY` no `.env`. Depois que um administrador já existe, essa rota bloqueia novas criações de admin.

### Login

Endpoint:

```txt
POST http://127.0.0.1:8000/auth/token
```

No Postman, use `Body -> x-www-form-urlencoded`:

```txt
username: admin@email.com
password: 12345678
```

A resposta retorna um token JWT:

```json
{
  "access_token": "token_jwt",
  "token_type": "bearer"
}
```

Para acessar rotas protegidas, envie o token no header:

```txt
Authorization: Bearer token_jwt
```

### Endpoints principais

Autenticação e usuários:

```txt
POST /auth/registrar
POST /auth/token
GET  /auth/me
GET  /admin/users
POST /admin/bootstrap-admin
```

Tarefas:

```txt
GET    /tarefas
POST   /tarefas
GET    /tarefas/{id_tarefa}
PUT    /tarefas/{id_tarefa}
PATCH  /tarefas/{id_tarefa}/status
DELETE /tarefas/{id_tarefa}
GET    /tarefas/{id_tarefa}/historico
```

Dashboard:

```txt
GET /dashboard
```

---

## Frontend

### Tecnologias do Frontend

- **React 18**
- **Vite** (Build Tool)
- **TailwindCSS v4** (Estilização utilitária)
- **React Router Dom** (Navegação SPA)
- **Axios** (Integração com a API)
- **Lucide React** (Biblioteca de Ícones)

### Funcionalidades do Frontend

- Login e Cadastro com feedback visual e integração via Context API.
- Dashboard dinâmico com cartões estatísticos.
- CRUD Completo com Modais sem recarregar a página.
- **Filtros Inteligentes e Busca:** Filtragem por Título, Status e Prioridade.
- Badges dinâmicos com cores diferentes de acordo com prioridade e status.
- Modal de Histórico de Alterações da tarefa em tempo real.

### Como rodar o Frontend localmente

1. Navegue até a pasta do frontend:

   ```bash
   cd frontend/frontend-task-manager
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

O sistema estará acessível no navegador em:

```txt
http://localhost:5173
```

---

## Observações

- As senhas são armazenadas com hash.
- O token JWT é enviado no padrão Bearer Token.
- O frontend usa Axios para enviar o token nas requisições autenticadas.
