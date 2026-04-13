import { OnSiteEvent } from "./entities/OnSiteEvent.js"
import {
  EventAlreadyExistsError,
  InvalidParameterError,
} from "./errors/index.js"

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
      throw new InvalidParameterError("ownerId")
    }

    if (ticketPriceInCents < 0) {
      throw new InvalidParameterError("ticketPriceInCents must be positive")
    }

    if (latitude < -90 || latitude > 90) {
      throw new InvalidParameterError("latitude must be between -90 and 90")
    }

    if (longitude < -180 || longitude > 180) {
      throw new InvalidParameterError("longitude must be between -180 and 180")
    }

    const now = new Date()
    if (date < now) {
      throw new InvalidParameterError("Date must be in the future")
    }

    const existingEvent = await this.eventRepository.getByDataLatAndLong({
      date,
      latitude,
      longitude,
    })

    if (existingEvent) {
      throw new EventAlreadyExistsError()
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
