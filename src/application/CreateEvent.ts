import { OnSiteEvent } from "./entities/OnSiteEvent.js"
import { InvalidOwnerIdError } from "./errors/index.js"

interface Input {
  name: string
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
}

// Port
export interface EventRepository {
  create: (input: OnSiteEvent) => Promise<OnSiteEvent>
  getByDataLatAndLong: (params: {
    date: Date
    latitude: number
    longitude: number
  }) => Promise<OnSiteEvent | null>
}

export class CreateEvent {
  // eventRepository: EventRepository
  // constructor(eventRepository: EventRepository) {
  //   this.eventRepository = eventRepository
  // }

  // Mesma coisa que o código acima, mas usando a sintaxe de parâmetros do construtor
  constructor(private eventRepository: EventRepository) {}

  async execute(input: Input) {
    const { ownerId, name, ticketPriceInCents, latitude, longitude, date } =
      input

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(ownerId)) {
      throw new InvalidOwnerIdError()
    }

    if (ticketPriceInCents < 0) {
      throw new Error("Invalid ticket price")
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude")
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude")
    }

    const now = new Date()
    if (date < now) {
      throw new Error("Date must be in the future")
    }

    const existingEvent = await this.eventRepository.getByDataLatAndLong({
      date,
      latitude,
      longitude,
    })

    if (existingEvent) {
      throw new Error("Event already exists")
    }

    const event = await this.eventRepository.create({
      id: crypto.randomUUID(),
      name,
      ownerId,
      ticketPriceInCents,
      latitude,
      longitude,
      date,
    })

    return event
  }
}
