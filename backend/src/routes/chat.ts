import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"

interface ChatRequest {
  message: string
  characterId: string
}

const router = Router()
const prisma = new PrismaClient()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

router.post("/", async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, characterId } = req.body

    if (!message || !characterId) {
      return res.status(400).json({ error: "Missing message or characterId" })
    }

    const character = await prisma.character.findUnique({ where: { id: characterId } })

    if (!character) {
      return res.status(404).json({ error: "Character not found" })
    }

    const history = await prisma.message.findMany({ where: { characterId }, orderBy: { createdAt: "asc" } })

    const messages: any[] = [
      {
        role: "system",
        content: `You are ${character.name}. Personality: ${character.personality}. Scenario: ${character.scenario}. Stay in character. Keep responses concise and engaging.`
      }
    ]

    history.forEach(m => {
      messages.push({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content
      })
    })

    messages.push({
      role: "user",
      content: message
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 500
    })

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    await prisma.message.createMany({
      data: [
        { characterId, sender: "user", content: message },
        { characterId, sender: "ai", content: reply }
      ]
    })

    res.json({ reply })
  } catch (error) {
    console.error("Chat error:", error)
    res.status(500).json({ error: "Failed to process chat request" })
  }
})

export default router