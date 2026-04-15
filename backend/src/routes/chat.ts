import express from "express"
import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"
import axios from "axios"           

const router = express.Router()
const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function buildPrompt(c: any) {
  return `
You are ${c.name}

Personality:
${c.personality}

Scenario:
${c.scenario}

Rules:
- Stay in character
- Add emotion (*smiles*)
- Write like novel
`
}

router.post("/:id", async (req, res) => {
  const { message } = req.body
  const { id } = req.params

  const character = await prisma.character.findUnique({ where: { id } })

  const history = await prisma.message.findMany({
    where: { characterId: id },
    orderBy: { createdAt: "asc" },
    take: 20
  })

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildPrompt(character) },
      ...history.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content
      })),
      { role: "user", content: message }
    ]
  })

  const reply = response.choices[0].message.content

  await prisma.message.createMany({
    data: [
      { characterId: id, sender: "user", content: message },
      { characterId: id, sender: "ai", content: reply }
    ]
  })

  res.json({ reply })
})

export default router