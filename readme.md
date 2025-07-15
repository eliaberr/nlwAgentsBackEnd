# NLW Agents - Backend

Este backend foi construído durante o 20º NLW da [Rocketseat](https://rocketseat.com.br/), com foco em praticar habilidades com **Node.js**, **Fastify** e integração com **IA da Google (Gemini)**.

## 🚀 Tecnologias e Bibliotecas Utilizadas

- **Node.js**
- **Fastify**
- **TypeScript**
- **Drizzle ORM** (com PostgreSQL e extensão pgvector)
- **Zod** (validações de schema)
- **Multer** (upload de áudio)
- **Google GenAI (Gemini)**:
  - Para transcrição de áudio
  - Geração de embeddings
  - Resposta inteligente a perguntas

## 💡 O que o backend faz?

Este backend oferece uma API que:

- Cria salas (rooms)
- Aceita upload de áudios (em buffer Base64)
- Transcreve os áudios usando IA (Gemini)
- Gera embeddings e armazena no banco com `pgvector`
- Permite que o usuário envie perguntas e recebe respostas baseadas nas transcrições dos áudios
- Utiliza vetores de similaridade para responder com base no conteúdo mais relevante

## 📂 Estrutura

- `src/http/routes`: todas as rotas organizadas por domínio (rooms, audio, questions)
- `src/db`: conexão, schema Drizzle e configuração pgvector
- `src/services`: integrações com a API do Gemini (transcrição, embeddings, respostas)
- `.env`: configurações sensíveis (API Key, banco)

---

## 🧩 Frontend do projeto

O frontend completo está disponível no repositório:  
🔗 [nlwAgentsFrontEnd](https://github.com/eliaberr/nlwAgentsFrontEnd.git)

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/nomedobanco
GEMINI_API_KEY=sua_chave_api_google_genai