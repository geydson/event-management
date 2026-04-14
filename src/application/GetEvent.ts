import { OnSiteEvent } from "./entities/OnSiteEvent.js"
import { InvalidParameterError, NotFoundError } from "./errors/index.js"

// DTO - Data Transfer Object
interface Input {
  id: string
}

// DTO - Data Transfer Object
interface Output {
  id: string
  name: string
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
}

// Port
export interface EventRepository {
  getById: (id: string) => Promise<OnSiteEvent | null>
}

export class GetEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(input: Input): Promise<Output> {
    const { id } = input

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(id)) {
      throw new InvalidParameterError("id")
    }

    const event = await this.eventRepository.getById(id)

    if (!event) {
      throw new NotFoundError("Event not found")
    }

    return event
  }
}
