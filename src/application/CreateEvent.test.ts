// import { StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { startPostgresTestDb } from "../db/teste-db.js"
import { EventRepositoryDrizzle } from "../resources/EventRepository.js"
import { CreateEvent } from "./CreateEvent.js"
import { db } from "../db/client.js"
import { eventsTable } from "../db/schema.js"

describe("createEvents", () => {
  // class EventRepositoryInMemory implements EventRepository {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   async create(input: any) {
  //     return input
  //   }
  // }

  let database: typeof db
  // let container: StartedPostgreSqlContainer

  beforeAll(async () => {
    const testDatabase = await startPostgresTestDb()
    database = testDatabase.db
    // container = testDatabase.container
  })

  beforeEach(async () => {
    await database.delete(eventsTable).execute()
  })

  // Encerrar os conatiners após os testes
  // afterAll(async () => {
  //   await database.$client.end()
  //   await container.stop()
  // })

  test("Deve criar um evento com sucesso", async () => {
    const createEvent = new CreateEvent(new EventRepositoryDrizzle(database))

    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }

    const output = await createEvent.execute(input)
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
  })

  test("Deve lançar um erro se o ownerId não for um UUID", async () => {
    const createEvent = new CreateEvent(new EventRepositoryDrizzle(database))

    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "invalid-uuid",
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ownerId"))
  })

  test("Deve lançar um erro se o ticket price for negativo", async () => {
    const createEvent = new CreateEvent(new EventRepositoryDrizzle(database))

    const input = {
      name: "Geydson Event",
      ticketPriceInCents: -5000,
      latitude: 37.7749,
      longitude: -122.4194,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ticket price"))
  })

  test("Deve lançar um erro se a latitude for inválida", async () => {
    const createEvent = new CreateEvent(new EventRepositoryDrizzle(database))

    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: -100, // latitude inválida
      longitude: -122.4194,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid latitude"))
  })

  test("Deve lançar um erro se a longitude for inválida", async () => {
    const createEvent = new CreateEvent(new EventRepositoryDrizzle(database))

    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: -90,
      longitude: -200, // longitude inválida
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid longitude"))
  })

  test("Deve lançar um erro se a data for no passado", async () => {
    const createEvent = new CreateEvent(new EventRepositoryDrizzle(database))

    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: -90,
      longitude: -180, // longitude inválida
      date: new Date(new Date().setHours(new Date().getHours() - 2)),
      ownerId: crypto.randomUUID(),
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(
      new Error("Date must be in the future")
    )
  })

  test("Deve lançar um erro se já existir um evento com a mesma data, longitude e latitude", async () => {
    const createEvent = new CreateEvent(new EventRepositoryDrizzle(database))

    const date = new Date(new Date().setHours(new Date().getHours() + 2))
    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: -90,
      longitude: -180, // longitude inválida
      date,
      ownerId: crypto.randomUUID(),
    }

    const output = await createEvent.execute(input)
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)

    const output2 = createEvent.execute(input)
    await expect(output2).rejects.toThrow(new Error("Event already exists"))
  })
})
