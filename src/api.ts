import express from "express"
import { CreateEvent } from "./application/CreateEvent.js"
import { EventRepositoryDatabase } from "./resources/EventRepository.js"

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.post("/events", async (req, res) => {
  const { name, ticketPriceInCents, latitude, longitude, date, ownerId } =
    req.body

  try {
    const eventRepositoryDatabase = new EventRepositoryDatabase()
    const createEvent = new CreateEvent(eventRepositoryDatabase)
    const event = await createEvent.execute({
      date: new Date(date),
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      ownerId,
    })
    res.status(201).json(event)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
