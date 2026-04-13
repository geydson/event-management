import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/node-postgres"
import { execSync } from "node:child_process"
import path from "node:path"

import * as schema from "../db/schema.js"

export const startPostgresTestDb = async () => {
  const container = await new PostgreSqlContainer("postgres:17")
    .withDatabase("event-management")
    .withUsername("test_user")
    .withPassword("test_password")
    .start()

  const db = drizzle(container.getConnectionUri(), { schema })
  const schemaPath = path.join(import.meta.dirname, "./schema.ts")

  execSync(
    `npx drizzle-kit push --dialect=postgresql --schema=${schemaPath} --url=${container.getConnectionUri()}`
  )

  return { container, db }
}
