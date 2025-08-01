import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [{
      text: 'Transcreva o áudio para portugues do brasil. Seja preciso e natural na trascrição. Mantenha a pontuação adequada e divida o texto em parágrafo ser for apropriado'
    },
    {
      inlineData: {
        mimeType,
        data: audioAsBase64
      }
    }
    ]
  })
  if (!response.text) {
    throw new Error('Não foi possivel converter o áudio')
  }
  return response.text
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT'
    }
  })
  if (!response.embeddings?.[0].values) {
    throw new Error("Não foi possivel retornar embeddings ")
  }
  return response.embeddings[0].values
}

export async function generateAnswer(question: string, transcriptions: string[]) {
  const context = transcriptions.join('\n\n')
  const prompt = `
    com base no texto fornecido abaixo como contexto, responda de forma clara e precisa em portugues do brasil
    CONTEXTO:
    ${context}

    PERGUNTA:
    ${question}

    INTRUÇÕES:
    - Use apenas informações contidas no contexto enviado:
    - Se a resposnta não for encontrada no contexto, apenas responda que não possui informações suficientes para responder
    - Seja objetivo;
    - Mantenha um tom educativo e profissional;
    - Cite trechos Relevantes do contexto se apropriado;
    - Se for citar o contexto , ultilize o termo "Conteúdo da aula"
  `.trim()
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt
      }
    ]
  })

   if (!response.text) {
    throw new Error("Não foi possível gerar resposta")
  }

  return response.text
}