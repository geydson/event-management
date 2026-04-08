import { OnSiteEvent } from "./entities/OnSiteEvent.js"

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
}

export class CreateEvent {
  eventRepository: EventRepository
  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(input: Input) {
    const { ownerId, name, ticketPriceInCents, latitude, longitude, date } =
      input

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(ownerId)) {
      throw new Error("Invalid ownerId")
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
