import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"

const router = Router()
const prisma = new PrismaClient()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

router.post("/", async (req, res) => {
  const { message, characterId } = req.body

  const character = await prisma.character.findUnique({ where: { id: characterId } })

  const history = await prisma.message.findMany({ where: { characterId } })

  const messages = [
    {
      role: "system",
      content: `You are ${character?.name}. Personality: ${character?.personality}. Scenario: ${character?.scenario}. Stay in character.`
    },
    ...history.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.content })),
    { role: "user", content: message }
  ]

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages as any
  })

  const reply = completion.choices[0].message.content

  await prisma.message.createMany({
    data: [
      { characterId, sender: "user", content: message },
      { characterId, sender: "ai", content: reply }
    ]
  })

  res.json({ reply })
})

export default router