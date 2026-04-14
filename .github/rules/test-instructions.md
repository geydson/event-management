## Regas gerais de Testes

- Seguimos arquitetura com testes para desenvolver esse projeto. Portanto, sempre que necessário criar um novo de teste, siga **EXATAMENTE** esse padrão:

## Use Cases

- Aoo escrever testes de use cases que recebam repositories como dependência, **SEMPRE** use a função "startPostgresTestDb" para iniciar um banco de dados de teste, **EXATAMENTE** como é feito em @src/application/CreateEvent.test.ts.
- **SEMPRE** crie uma função `makeSut` que faz a criação do objeto que esta sendo testado. Exemplo:

```typescript
const makeSut = () => {
  const eventRepository = new EventRepositoryDrizzle(database)
  const sut = new CreateEvent(eventRepository)

  return { sut, eventRepository }
}
```

- Ao testar use cases com baco de dados de teste, **SEMPRE** limpe as tabelas as tabelas necessárias antes de cada teste.

```typescript
beforeAll(async () => {
  const testDatabase = await startPostgresTestDb()
  database = testDatabase.db
  // container = testDatabase.container
})

beforeEach(async () => {
  await database.delete(eventsTable).execute()
})
```

- **SEMPRE** escreva testes para todos os cenários possíveis.
- **SEMPRE** use o arquivo @src/application/CreateEvent.test.ts como referência para criar os testes.
