import { fastify } from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { env } from "./env.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { createRoomRoute } from "./http/routes/create-rooms.ts";
import { getRoomsQuestions } from "./http/routes/get-rooms-questions.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";
import { uploadAudioRoute } from "./http/routes/upload-audio.ts";
import fastifyMultipart from "@fastify/multipart";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.get("/health", () => { return "OK" })
app.register(fastifyCors, { origin: "http://localhost:5173" })
app.register(fastifyMultipart)
app.register(getRoomsRoute)
app.register(createRoomRoute)
app.register(getRoomsQuestions)
app.register(createQuestionRoute)
app.register(uploadAudioRoute)
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.listen({ port: env.PORT })