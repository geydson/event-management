# 🎉 Event Management API

Uma API RESTful moderna para gerenciamento de eventos desenvolvida com Node.js, TypeScript e Fastify, seguindo os princípios da Arquitetura Hexagonal (Ports & Adapters).

## 📋 Sobre o Projeto

Este projeto é uma API completa para gerenciamento de eventos presenciais. Permite criar, buscar e gerenciar eventos com informações como localização geográfica, data, preço de ingresso e proprietário do evento.

### ✨ Funcionalidades

- ✅ Criar eventos presenciais
- ✅ Buscar evento por ID
- ✅ Validação de dados robusta com Zod
- ✅ Validação de localização e datas
- ✅ Prevenção de conflitos (eventos no mesmo local, hora e data)
- ✅ Documentação automática com Swagger
- ✅ Cobertura de testes com Vitest

## 🏗️ Arquitetura

O projeto segue a **Arquitetura Hexagonal** (Ports & Adapters), organizando o código em camadas:

- **Domain/Entities**: Entidades de negócio (`OnSiteEvent`)
- **Application**: Casos de uso (`CreateEvent`, `GetEvent`)
- **Resources/Adapters**: Implementações de repositórios (`EventRepositoryDrizzle`)
- **API**: Camada de apresentação (rotas Fastify)

```
src/
├── application/        # Casos de uso e regras de negócio
│   ├── entities/       # Entidades do domínio
│   └── errors/         # Erros de domínio customizados
├── resources/          # Adaptadores (repositórios)
├── db/                 # Configuração de banco de dados
└── api.ts              # API Fastify e rotas
```

## 🚀 Tecnologias

- **[Node.js](https://nodejs.org/)** (>= 22) - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Fastify](https://fastify.dev/)** - Framework web de alta performance
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript-first
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[Vitest](https://vitest.dev/)** - Framework de testes unitários
- **[Docker](https://www.docker.com/)** - Containerização
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação de API

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) >= 10
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd event-management
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/event-management
PORT=8085
```

4. **Inicie o banco de dados**

```bash
docker-compose up -d
```

5. **Execute as migrations**

```bash
pnpm drizzle-kit push
```

## 🎯 Como Usar

### Modo Desenvolvimento

Inicie o servidor em modo de desenvolvimento com hot-reload:

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:8085`

### Documentação da API

Acesse a documentação interativa Swagger:

```
http://localhost:8085/docs
```

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia o servidor em modo desenvolvimento

# Testes
pnpm test             # Executa os testes
pnpm test:watch       # Executa os testes em modo watch
pnpm test:coverage    # Gera relatório de cobertura de testes

# Banco de Dados
pnpm drizzle-kit push      # Aplica migrations
pnpm drizzle-kit studio    # Abre o Drizzle Studio (GUI do banco)

# Code Quality
pnpm prepare          # Configura hooks do Husky
```

## 🔌 Endpoints da API

### Criar Evento

```http
POST /events
Content-Type: application/json

{
  "name": "Evento de Tecnologia",
  "ticketPriceInCents": 5000,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "date": "2026-05-20T18:00:00.000Z",
  "ownerId": "uuid-do-proprietario"
}
```

**Resposta (201)**

```json
{
  "id": "uuid-do-evento",
  "name": "Evento de Tecnologia",
  "ticketPriceInCents": 5000,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "date": "2026-05-20T18:00:00.000Z",
  "ownerId": "uuid-do-proprietario"
}
```

### Buscar Evento por ID

```http
GET /events/{id}
```

**Resposta (200)**

```json
{
  "id": "uuid-do-evento",
  "name": "Evento de Tecnologia",
  "ticketPriceInCents": 5000,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "date": "2026-05-20T18:00:00.000Z",
  "ownerId": "uuid-do-proprietario"
}
```

## 🧪 Testes

O projeto utiliza Vitest com testcontainers para testes de integração com banco de dados real.

```bash
# Executar todos os testes
pnpm test

# Executar testes específicos
pnpm test CreateEvent
pnpm test GetEvent

# Gerar relatório de cobertura
pnpm test:coverage
```

### Estrutura de Testes

- `*.test.ts` - Testes unitários e de integração
- Testcontainers - Banco PostgreSQL em container para testes
- Cobertura de casos: sucesso, validações e falhas

## 🎨 Padrões de Código

O projeto segue padrões rigorosos de qualidade:

- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Commitlint** - Validação de mensagens de commit (Conventional Commits)
- **Husky** - Git hooks para qualidade de código
- **TypeScript Strict Mode** - Tipagem forte

### Regras de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
test: adiciona ou atualiza testes
refactor: refatora código
chore: tarefas de manutenção
```

## 📁 Estrutura do Projeto

```
event-management/
├── .github/
│   ├── copilot-instructions.md    # Instruções para GitHub Copilot
│   └── rules/                     # Regras de design e testes
├── drizzle/                       # Migrations do Drizzle
├── src/
│   ├── application/               # Casos de uso
│   │   ├── entities/              # Entidades de domínio
│   │   ├── errors/                # Erros customizados
│   │   ├── CreateEvent.ts         # Use case: Criar evento
│   │   ├── CreateEvent.test.ts    # Testes do CreateEvent
│   │   ├── GetEvent.ts            # Use case: Buscar evento
│   │   └── GetEvent.test.ts       # Testes do GetEvent
│   ├── resources/                 # Repositórios (Adapters)
│   │   ├── EventRepository.ts     # Implementação do repositório
│   │   └── EventRepository.test.ts
│   ├── db/                        # Banco de dados
│   │   ├── client.ts              # Cliente Drizzle
│   │   ├── schema.ts              # Schema do banco
│   │   └── teste-db.ts            # Setup de testes
│   └── api.ts                     # Servidor Fastify
├── coverage/                      # Relatórios de cobertura
├── docker-compose.yml             # Configuração Docker
├── drizzle.config.ts              # Configuração Drizzle
├── package.json                   # Dependências e scripts
├── tsconfig.json                  # Configuração TypeScript
└── vitest.config.ts               # Configuração Vitest
```

## 🔒 Regras de Negócio

### Validações de Evento

- ✅ `ownerId` deve ser um UUID válido
- ✅ `ticketPriceInCents` deve ser positivo
- ✅ `latitude` deve estar entre -90 e 90
- ✅ `longitude` deve estar entre -180 e 180
- ✅ `date` deve ser uma data futura
- ✅ Não pode haver eventos no mesmo local (lat/long) e data/hora

### Tratamento de Erros

- `400 Bad Request` - Parâmetros inválidos
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Evento já existe (mesmo local/data)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feat/nova-feature`)
5. Abra um Pull Request

---

⭐ Se este projeto foi útil, considere dar uma estrela!
