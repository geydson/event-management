import axios from "axios"

axios.defaults.validateStatus = () => {
  return true
}

describe("POST /events", () => {
  test("Deve criar um evento com sucesso", async () => {
    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      date: new Date().setHours(new Date().getHours() + 1),
      ownerId: crypto.randomUUID(),
    }

    const response = await axios.post("http://localhost:3000/events", input)
    expect(response.status).toBe(201)
    expect(response.data.name).toBe(input.name)
    expect(response.data.ticketPriceInCents).toBe(input.ticketPriceInCents)
    // expect(response.data.latitude).toBe(input.latitude)
    // expect(response.data.longitude).toBe(input.longitude)
    expect(response.data.ownerId).toBe(input.ownerId)
  })

  test("Deve retornar 400 se o createEvent lançar uma exceção", async () => {
    const input = {
      name: "Geydson Event",
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      date: new Date().setHours(new Date().getHours() + 1),
      ownerId: "invalid-uuid",
    }

    const response = await axios.post("http://localhost:3000/events", input)
    expect(response.status).toBe(400)
  })
})
