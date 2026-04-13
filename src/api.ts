import { CreateEvent } from "./application/CreateEvent.js"
import { EventRepositoryDrizzle } from "./resources/EventRepository.js"
import fastify, { FastifyReply, FastifyRequest } from "fastify"
import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import z from "zod"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"

import { db } from "./db/client.js"
import {
  EventAlreadyExistsError,
  InvalidParameterError,
  NotFoundError,
} from "./application/errors/index.js"

const app = fastify()

// Usado com o Express
// app.use(express.json())

const PORT = process.env.PORT || 8085

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Event Management API",
      description: "API para gerenciamento de eventos",
      version: "1.0.0",
    },
    servers: [
      {
        description: "Servidor local",
        url: "http://localhost:8085",
      },
    ],
  },
  transform: jsonSchemaTransform,
})

await app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

await app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/events",
  schema: {
    tags: ["Events"],
    summary: "Cria um novo evento",
    body: z.object({
      name: z.string().default("Geydson Event"),
      ticketPriceInCents: z.number().default(5000),
      latitude: z.number().default(37.7749),
      longitude: z.number().default(-122.4194),
      date: z.iso
        .datetime()
        .default(
          new Date(new Date().setHours(new Date().getHours() + 1)).toISOString()
        ),
      ownerId: z.uuid(),
    }),
    response: {
      201: z.object({
        code: z.string(),
        id: z.uuid(),
        name: z.string(),
        ticketPriceInCents: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        date: z.iso.datetime(),
        ownerId: z.uuid(),
      }),
      400: z.object({
        code: z.string(),
        message: z.string(),
      }),
      404: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },
  handler: async (req: FastifyRequest, res: FastifyReply) => {
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
      return res.status(201).send({ ...event, date: event.date.toISOString() })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error instanceof InvalidParameterError ||
        error instanceof EventAlreadyExistsError
      ) {
        return res
          .status(400)
          .send({ code: "INVALID_PARAMETER", message: error.message })
      }

      if (error instanceof NotFoundError) {
        return res
          .status(404)
          .send({ code: error.code, message: error.message })
      }

      return res
        .status(400)
        .send({ code: "SERVER_ERROR", message: error.message })
    }
  },
})

await app.ready()
await app.listen({ port: PORT }, () => {
  console.log(`Server is running on port ${PORT}`)
})
