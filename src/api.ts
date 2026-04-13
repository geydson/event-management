import { CreateEvent } from "./application/CreateEvent.js"
import { EventRepositoryDrizzle } from "./resources/EventRepository.js"
import fastify, { FastifyReply, FastifyRequest } from "fastify"

import { db } from "./db/client.js"

const app = fastify()

// Usado com o Express
// app.use(express.json())

const PORT = process.env.PORT || 3000

app.post("/events", async (req: FastifyRequest, res: FastifyReply) => {
  const { name, ticketPriceInCents, latitude, longitude, date, ownerId } =
    req.body as {
      name: string
      ticketPriceInCents: number
      latitude: number
      longitude: number
      date: string
      ownerId: string
    }

  try {
    const eventRepositoryDatabase = new EventRepositoryDrizzle(db)
    const createEvent = new CreateEvent(eventRepositoryDatabase)
    const event = await createEvent.execute({
      date: new Date(date),
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      ownerId,
    })
    res.status(201).send(event)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res.status(400).send({ message: error.message })
  }
})

app.listen({ port: PORT }, () => {
  console.log(`Server is running on port ${PORT}`)
})
