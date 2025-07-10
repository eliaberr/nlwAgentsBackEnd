import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts"
import { id } from "zod/v4/locales"

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/rooms', async () => {
    const results = await db.select({id: schema.rooms.id, name: schema.rooms.name}).from(schema.rooms).orderBy(schema.rooms.createAt)

    return results
  })
}