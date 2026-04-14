## Regras gerais da Arquitetura

- Seguimos arquitetura hexagonal para desenvolver esse projeto. Portanto, sempre que necessário criar uma nova rota de API, siga **EXATAMENTE** esse padrão:

## Driver (API)

- Cria a rota em @src/api.ts
- **SEMPRE** use Fastify e o Zod para validar os tipos de dados da requisição. Exemplo:

```typescript
await app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/events",
  schema: {
    tags: ["Events"],
    summary: "Cria um novo evento",
    body: z.object({
      name: z.string().default("Geydson Event"),
      ticketPriceInCents: z.number().default(5000),
      latitude: z.number().default(37.7749),
      longitude: z.number().default(-122.4194),
      date: z.iso
        .datetime()
        .default(
          new Date(new Date().setHours(new Date().getHours() + 1)).toISOString()
        ),
      ownerId: z.uuid(),
    }),
    response: {
      201: z.object({
        code: z.string(),
        id: z.uuid(),
        name: z.string(),
        ticketPriceInCents: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        date: z.iso.datetime(),
        ownerId: z.uuid(),
      }),
      400: z.object({
        code: z.string(),
        message: z.string(),
      }),
      404: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },
  handler: {},
})
```

- uma rota de API deve **SEMPRE** chamar um use case.
- **SEMPRE** trate erros customizados que o use case eventualmeente lançar. Exemplo:

```typescript
catch (error: any) {
  if (
    error instanceof InvalidParameterError ||
    error instanceof EventAlreadyExistsError
  ) {
    return res
      .status(400)
      .send({ code: "INVALID_PARAMETER", message: error.message })
  }

  if (error instanceof NotFoundError) {
    return res
      .status(404)
      .send({ code: error.code, message: error.message })
  }
}
```

## Use Case

- **TODAS** as regras de negócio devem estar contidas no use case.
- Um use case deve **SEMPRE** receber uma interface Input e retornar uma interface Output, exatamente como é feito em @src/application/CreateEvent.ts.
- Quando necessário lançar uma exceção, **SEMPRE** lance um erro customizado. Esses erros são criados em @src/application/errors/index.ts. **SEMPRE** verifique os erros que jaá foram criados antes de criar um novo.
- Um use case **NUNCA** deve ter um try catch.
- **SEMPRE** que for necessário executar operações em um banco de dados, **SEMPRE** receba o repository correspondente como dependências no construtor da classe. **EXATAMENTE** como é feito em @src/application/CreateEvent.ts. A interface do repository que é recebido como dependência no construtor deve ser definida no arquivo do use case.

## Repository

- **SEMPRE** use o Drizzle para interagir com o banco de dados.
- Ao criar um repository, **SEMPRE** receba o cliente do Drizzle como dependência no construtor da classe, **EXATAMENTE** como é feito em @src/resources/EventRepository.ts.
- **SEMPRE** receba e retorne uma interface de domínio em operações de criação e atualização, assim como é feito em @src/resources/EventRepository.ts.
- **SEMPRE** retorne um objeto de domínio em operação de listagem.
- Ao criar um repository, **SEMPRE** implemente a interface definida no use case, assim como é feito em @src/resources/EventRepository.ts.
