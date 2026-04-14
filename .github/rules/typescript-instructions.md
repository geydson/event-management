## Regras para arquivos TypeScript (.ts)

- Aplicar todas as regras abaixo apenas para arquivos TypeScript
- **SEMPRE** usar tipagem forte
- **NUNCA** usar "any"

## Regras de Classes

- **SEMPRE** use private ou protected nas propriedades da classe. Exemplo:

```typescript
// Correto
class UserService {
  private readonly repository: UserRepository
  protected logger: Logger

  constructor(repository: UserRepository) {
    this.repository = repository
  }
}

// Evite
class UserService {
  public repository: UserRepository
  logger: Logger
}
```

## Funções

- **SEMPRE** que uma função receber mais de um parâmetro, receba um objeto como parâmetro. Exemplo:

```typescript
interface Input {
  name: string
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
}

export interface EventRepository {
  create: (input: Input) => Promise<OnSiteEvent>
}
```
