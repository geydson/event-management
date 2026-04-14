import { startPostgresTestDb } from "../db/teste-db.js"
import { EventRepositoryDrizzle } from "../resources/EventRepository.js"
import { GetEvent } from "./GetEvent.js"
import { db } from "../db/client.js"
import { eventsTable } from "../db/schema.js"
import { InvalidParameterError, NotFoundError } from "./errors/index.js"

describe("GetEvent", () => {
  const makeSut = () => {
    const eventRepository = new EventRepositoryDrizzle(database)
    const sut = new GetEvent(eventRepository)

    return { sut, eventRepository }
  }

  let database: typeof db

  beforeAll(async () => {
    const testDatabase = await startPostgresTestDb()
    database = testDatabase.db
  })

  beforeEach(async () => {
    await database.delete(eventsTable).execute()
  })

  test("Deve buscar um evento por ID com sucesso", async () => {
    const { sut } = makeSut()

    // Criar um evento primeiro
    const eventId = crypto.randomUUID()
    await database.insert(eventsTable).values({
      id: eventId,
      name: "Geydson Event",
      ticket_price_in_cents: 5000,
      latitude: "37.774900",
      longitude: "-122.419400",
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      owner_id: crypto.randomUUID(),
    })

    const output = await sut.execute({ id: eventId })

    expect(output.id).toBe(eventId)
    expect(output.name).toBe("Geydson Event")
    expect(output.ticketPriceInCents).toBe(5000)
    expect(output.latitude).toBe(37.7749)
    expect(output.longitude).toBe(-122.4194)
  })

  test("Deve lançar um erro se o ID não for um UUID", async () => {
    const { sut } = makeSut()

    const output = sut.execute({ id: "invalid-uuid" })

    await expect(output).rejects.toThrow(new InvalidParameterError("id"))
  })

  test("Deve lançar um erro se o evento não for encontrado", async () => {
    const { sut } = makeSut()

    const nonExistentId = crypto.randomUUID()
    const output = sut.execute({ id: nonExistentId })

    await expect(output).rejects.toThrow(new NotFoundError("Event not found"))
  })
})
