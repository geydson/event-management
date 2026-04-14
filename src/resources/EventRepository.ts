import "dotenv/config"

import * as schema from "../db/schema.js"
import { EventRepository } from "../application/CreateEvent.js"
import { OnSiteEvent } from "../application/entities/OnSiteEvent.js"
import { and, eq } from "drizzle-orm"
import { db } from "../db/client.js"

// Adapter
export class EventRepositoryDrizzle implements EventRepository {
  constructor(private database: typeof db) {}

  async getById(id: string): Promise<OnSiteEvent | null> {
    const output = await this.database.query.eventsTable.findFirst({
      where: eq(schema.eventsTable.id, id),
    })

    if (!output) {
      return null
    }

    return {
      date: output.date,
      id: output.id,
      latitude: Number(output.latitude),
      longitude: Number(output.longitude),
      name: output.name,
      ownerId: output.owner_id,
      ticketPriceInCents: output.ticket_price_in_cents,
    }
  }

  async getByDataLatAndLong(params: {
    date: Date
    latitude: number
    longitude: number
  }): Promise<OnSiteEvent | null> {
    const output = await this.database.query.eventsTable.findFirst({
      where: and(
        eq(schema.eventsTable.date, params.date),
        eq(schema.eventsTable.latitude, params.latitude.toString()),
        eq(schema.eventsTable.longitude, params.longitude.toString())
      ),
    })

    if (!output) {
      return null
    }

    return {
      date: output?.date,
      id: output.id,
      latitude: Number(output.latitude),
      longitude: Number(output.longitude),
      name: output.name,
      ownerId: output.owner_id,
      ticketPriceInCents: output.ticket_price_in_cents,
    }
  }

  async create(input: OnSiteEvent): Promise<OnSiteEvent> {
    const [output] = await this.database
      .insert(schema.eventsTable)
      .values({
        // @ts-expect-error - d
        id: input.id,
        date: input.date,
        latitude: input.latitude,
        longitude: input.longitude,
        name: input.name,
        owner_id: input.ownerId,
        ticket_price_in_cents: input.ticketPriceInCents,
      })
      .returning()
    return {
      date: output.date,
      id: output.id,
      latitude: Number(output.latitude),
      longitude: Number(output.longitude),
      name: output.name,
      ownerId: output.owner_id,
      ticketPriceInCents: output.ticket_price_in_cents,
    }
  }
}
