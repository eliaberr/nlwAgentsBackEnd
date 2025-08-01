import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { z } from "zod/v4"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts"
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts"
import { and, eq, sql } from "drizzle-orm"

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post('/rooms/:roomId/questions', {
    schema: {
      params: z.object({
        roomId: z.string()
      }),
      body: z.object({
        question: z.string().min(1),
      })
    }
  }, async (request, reply) => {
    const { roomId } = request.params
    const { question } = request.body
    const embeddings = await generateEmbeddings(question)
    const embeddingAsString = `[${embeddings.join(',')}]`
    const chunks = await db.select({
      id: schema.audioChunks.id,
      transcription: schema.audioChunks.transcription,
      similarity: sql<number>`${schema.audioChunks.embeddings} <=> ${embeddingAsString}::vector`
    })
      .from(schema.audioChunks)
      .where(
        and(
          eq(schema.audioChunks.roomId, roomId),
          sql`${schema.audioChunks.embeddings} <=> ${embeddingAsString}::vector <= 0.7`
        )
      )
      .orderBy(
        sql`${schema.audioChunks.embeddings} <=> ${embeddingAsString}::vector`
      )
      .limit(3)

    let answer: string | null = null

    if (chunks.length > 0) {
      const transcription = chunks.map(chunk => chunk.transcription)

      answer = await generateAnswer(question, transcription)
    }

    const result = await db.insert(schema.questions).values({
      roomId,
      question,
      answer
    }).returning()
    const insertQuestion = result[0]
    if (!insertQuestion) {
      throw new Error('Falied to create new question.')
    }
    return reply.status(201).send({ questionId: insertQuestion.id, answer })
  })
}