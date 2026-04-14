# 🎉 Event Management API

Uma API RESTful moderna para gerenciamento de eventos desenvolvida com Node.js, TypeScript e Fastify, seguindo os princípios da Arquitetura Hexagonal (Ports & Adapters).

## 📋 Sobre o Projeto

Este projeto é uma API em desenvolvimento para gerenciamento de eventos presenciais. Atualmente permite criar e buscar eventos com informações como localização geográfica, data, preço de ingresso e proprietário do evento.

> **⚠️ Projeto em Desenvolvimento**: Novos módulos e funcionalidades estão sendo implementados.

### ✨ Funcionalidades Implementadas

- ✅ Criar eventos presenciais
- ✅ Buscar evento por ID
- ✅ Validação de dados robusta com Zod
- ✅ Validação de localização e datas
- ✅ Prevenção de conflitos (eventos no mesmo local, hora e data)
- ✅ Documentação automática com Swagger
- ✅ Cobertura de testes com Vitest

### 🚧 Em Desenvolvimento

- 🔄 Atualizar eventos
- 🔄 Deletar eventos
- 🔄 Listar eventos com filtros e paginação
- 🔄 Sistema de autenticação e autorização
- 🔄 Gerenciamento de ingressos
- 🔄 Sistema de participantes

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

O projeto possui uma estratégia robusta de testes automatizados, garantindo qualidade e confiabilidade do código.

### Tecnologias de Teste

- **[Vitest](https://vitest.dev/)** - Framework de testes rápido e moderno
- **[Testcontainers](https://testcontainers.com/)** - Containers PostgreSQL reais para testes de integração
- **Coverage V8** - Relatórios de cobertura de código

### Comandos de Teste

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch (desenvolvimento)
pnpm test:watch

# Executar testes específicos
pnpm test CreateEvent
pnpm test GetEvent
pnpm test EventRepository

# Gerar relatório de cobertura
pnpm test:coverage
```

### Estratégia de Testes

#### 1. **Testes E2E (End-to-End) da API**

Testam a API completa com requisições HTTP reais:

- `api.test.ts` - Testes dos endpoints REST

**O que é testado:**

- ✅ Requisições HTTP reais (POST, GET)
- ✅ Status codes de resposta (201, 200, 400, 404)
- ✅ Validação de payloads de entrada
- ✅ Formato de resposta JSON
- ✅ Integração completa (API → Use Case → Repository → Banco)

**Bibliotecas:**

- **Axios** - Cliente HTTP para requisições
- Servidor rodando em `http://localhost:8085`

**Exemplo de teste E2E:**

```typescript
test("Deve criar um evento com sucesso", async () => {
  const input = {
    name: "Evento de Tecnologia",
    ticketPriceInCents: 5000,
    // ...
  }

  const response = await axios.post("http://localhost:8085/events", input)

  expect(response.status).toBe(201)
  expect(response.data.name).toBe(input.name)
})
```

> **📌 Nota**: Os testes E2E requerem que o servidor esteja rodando (`pnpm dev`). Eles validam o fluxo completo desde a requisição HTTP até a persistência no banco de dados.

#### 2. **Testes Unitários de Use Cases**

Testam a lógica de negócio isoladamente:

- `CreateEvent.test.ts` - Casos de uso de criação
- `GetEvent.test.ts` - Casos de uso de busca

**Exemplos de cenários testados:**

- ✅ Criação de evento com dados válidos
- ✅ Validação de UUID do proprietário
- ✅ Validação de preço de ingresso (não negativo)
- ✅ Validação de latitude (-90 a 90)
- ✅ Validação de longitude (-180 a 180)
- ✅ Validação de data futura
- ✅ Prevenção de conflito (mesmo local/data)
- ✅ Busca de evento existente
- ✅ Erro ao buscar evento inexistente
- ✅ Erro com ID inválido

#### 3. **Testes de Integração de Repositório**

Testam a integração com o banco de dados real usando Testcontainers:

- `EventRepository.test.ts` - Operações de persistência

**O que é testado:**

- Inserção de dados no PostgreSQL
- Consultas com Drizzle ORM
- Conversão de tipos (decimal para number)
- Queries complexas com múltiplas condições

#### 4. **Testcontainers - Banco Real**

Diferente de mocks, usamos um **PostgreSQL real em container Docker** durante os testes:

**Vantagens:**

- ✅ Testes mais realistas e confiáveis
- ✅ Detecta problemas de schema e queries
- ✅ Valida conversões de tipos do banco
- ✅ Simula o ambiente de produção

**Como funciona:**

```typescript
// Setup executado antes dos testes
beforeAll(async () => {
  const testDatabase = await startPostgresTestDb()
  database = testDatabase.db
})

// Limpa dados entre testes
beforeEach(async () => {
  await database.delete(eventsTable).execute()
})
```

### Estrutura de Arquivos de Teste

```
src/
├── api.test.ts                   # ← Testes E2E da API
├── application/
│   ├── CreateEvent.ts
│   ├── CreateEvent.test.ts       # ← Testes unitários do use case
│   ├── GetEvent.ts
│   └── GetEvent.test.ts          # ← Testes unitários do use case
├── resources/
│   ├── EventRepository.ts
│   └── EventRepository.test.ts   # ← Testes de integração com banco
└── db/
    └── teste-db.ts               # ← Setup testcontainers
```

### Cobertura de Testes

Visualize a cobertura completa:

```bash
pnpm test:coverage
```

O relatório é gerado em `coverage/index.html` e pode ser aberto no navegador.

#### 📊 Cobertura Atual

```
Test Files: 4 passed (4)
Tests: 14 passed (14)

File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
application/CreateEvent   |   100%  |   100%   |  100%   |  100%   | ✅
application/GetEvent      |   100%  |   100%   |  100%   |  100%   | ✅
application/errors        |   100%  |   100%   |  100%   |  100%   | ✅
resources/EventRepository |   100%  |   100%   |  100%   |  100%   | ✅
```

**Camadas com 100% de cobertura:**

- ✅ **Use Cases** - Toda lógica de negócio testada
- ✅ **Repositories** - Todas operações de banco testadas
- ✅ **Errors** - Todos erros customizados testados

**Cobertura adicional:**

- ✅ **API E2E** - 2 testes de integração completa (POST e validações)

**Arquivos não testados (propositalmente):**

- ⚪ `client.ts` - Cliente de banco de dados (apenas configuração)
- ⚪ Arquivos de configuração (ESLint, Drizzle, Commitlint, etc)

> **💡 Estratégia**: Cobertura de 100% nas camadas de **negócio** (use cases) e **persistência** (repositories), complementada por testes **E2E** que validam o fluxo completo da API.

**Métricas monitoradas:**

- **Statements** - Porcentagem de declarações executadas
- **Branches** - Cobertura de condicionais (if/else)
- **Functions** - Funções testadas
- **Lines** - Linhas de código cobertas

### Padrão de Testes

O projeto segue o padrão **AAA (Arrange-Act-Assert)**:

```typescript
test("Deve criar um evento com sucesso", async () => {
  // Arrange - Preparar dados
  const { sut } = makeSut()
  const input = {
    name: "Evento de Tecnologia",
    ticketPriceInCents: 5000,
    // ...
  }

  // Act - Executar ação
  const output = await sut.execute(input)

  // Assert - Verificar resultado
  expect(output.id).toBeDefined()
  expect(output.name).toBe(input.name)
})
```

### Factory Pattern (makeSut)

Usamos o padrão **Factory** para criar instâncias de teste:

```typescript
const makeSut = () => {
  const eventRepository = new EventRepositoryDrizzle(database)
  const sut = new CreateEvent(eventRepository) // sut = System Under Test
  return { sut, eventRepository }
}
```

**Benefícios:**

- Código de teste mais limpo
- Fácil de modificar dependências
- Reutilização entre testes

### Boas Práticas Implementadas

- ✅ Isolamento entre testes (limpeza do banco)
- ✅ Nomes descritivos de testes
- ✅ Um assert por conceito testado
- ✅ Testes independentes e determinísticos
- ✅ Sem sleeps ou timeouts desnecessários
- ✅ Setup e teardown apropriados
- ✅ Testes rápidos (< 10s total)

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
