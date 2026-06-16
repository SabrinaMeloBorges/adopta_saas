# Adopta

Sistema web full stack para adoção de pets, desenvolvido como trabalho prático da disciplina **Linguagem de Programação V**.

> Site acolhedor que conecta pets resgatados a famílias que querem adotar. Adotantes navegam pelos pets disponíveis, favoritam e solicitam adoção; ONGs/admins cadastram pets, gerenciam fichas de vacinação e respondem solicitações.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Front-end | Angular (última versão), Angular Material (Material Design 3), Bootstrap (grid), SCSS |
| Back-end | Node.js, Express, JWT, bcrypt |
| Banco | MySQL 8 |
| Infra | Docker, Docker Compose |

## Estrutura do projeto

```
adopta/
├── backend/        # API Express
├── frontend/       # SPA Angular
├── docs/           # Documentação acadêmica (requisitos, personas, etc.)
├── docker-compose.yml
└── PLANO.md        # Plano detalhado de implementação
```

---

## Pré-requisitos

Você precisa ter instalado na sua máquina:

- **Docker** e **Docker Compose** (versão 2+)
- **Git**

Tudo o mais (Node, Angular CLI, MySQL) roda dentro dos containers — você **não precisa** instalar localmente.

> Para verificar: `docker --version` e `docker compose version`

---

## Como executar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio> adopta
cd adopta
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Abra o `.env` e ajuste o que achar necessário (os valores padrão funcionam pra desenvolvimento).

### 3. Suba os containers

```bash
docker compose up --build
```

Na primeira execução o Docker vai:
1. Baixar a imagem do MySQL 8
2. Construir a imagem do backend (Node + Express)
3. Construir a imagem do frontend (Angular)
4. Criar o banco `adopta` e rodar o `schema.sql` + `seed.sql` automaticamente
5. Subir os 3 serviços

Aguarde até ver a mensagem `Backend rodando em http://localhost:3000` e `Compiled successfully` do Angular.

### 4. Acesse

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000/api |
| MySQL | localhost:3306 (usuário: `adopta`, senha: ver `.env`) |

### 5. Credenciais de demonstração

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | `admin@adopta.com` | `admin123` |
| Adotante exemplo | `mariana@example.com` | `mariana123` |

---

## Comandos úteis

```bash
# Subir em modo daemon (background)
docker compose up -d

# Ver logs em tempo real
docker compose logs -f

# Parar os containers
docker compose down

# Parar e remover dados do banco (RESETA tudo)
docker compose down -v

# Reconstruir do zero
docker compose up --build --force-recreate

# Acessar o MySQL pelo terminal
docker compose exec db mysql -u adopta -p adopta

# Acessar o shell do container backend
docker compose exec backend sh
```

---

## Desenvolvimento sem Docker (opcional)

Se preferir rodar localmente sem container:

### Backend

```bash
cd backend
npm install
# Configure o .env do backend apontando pro seu MySQL local
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npx ng serve
```

---

## Funcionalidades

### Visitante (não autenticado)
- Listagem de pets com filtros (espécie, porte, sexo, cidade, status)
- Busca por nome ou raça
- Página de detalhes com galeria de fotos, ficha de vacinação e personalidade
- Favoritar pets (armazenado localmente no navegador)
- Galeria de pets já adotados (histórias felizes)

### Adotante autenticado
- Tudo acima +
- Solicitar adoção de um pet
- Acompanhar status das próprias solicitações

### Admin (ONG/abrigo)
- Dashboard com indicadores
- CRUD completo de pets (com upload de fotos em base64 e ficha de vacinação)
- Gerenciar solicitações (aprovar, rejeitar, marcar como concluída)

---

## Documentação

Toda a documentação acadêmica está em [`docs/`](docs/):

- [Requisitos](docs/01-requisitos.md) — funcionais, não funcionais e regras de negócio
- [Personas](docs/02-personas.md)
- [User Stories](docs/03-user-stories.md)
- [Design System](docs/04-design-system.md)
- [Fluxo de Navegação](docs/05-fluxo-navegacao.md)

O plano técnico completo está em [`PLANO.md`](PLANO.md).

---

## Licença

Projeto acadêmico — uso educacional.
