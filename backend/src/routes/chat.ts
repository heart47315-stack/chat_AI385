import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

function buildPrompt(c: any) {
  return `
You are ${c.name}

Personality:
${c.personality}

Scenario:
${c.scenario}
`
}

function mockAIReply(message: string, character: any) {
  // ทำให้ตอบมีคาแรคเตอร์หน่อย
  if (message.toLowerCase().includes("hello")) {
    return `${character.name} *smiles softly* "Hello... I've been waiting for you."`
  }

  if (message.toLowerCase().includes("name")) {
    return `${character.name} *tilts head* "You already know my name... don't you?"`
  }

  return `${character.name} *looks at you* "${message}... that's interesting."`
}

router.post("/:id", async (req, res) => {
  const { message } = req.body
  const { id } = req.params

  const character = await prisma.character.findUnique({
    where: { id }
  })

  if (!character) {
    return res.status(404).json({ error: "Character not found" })
  }

  // ดึง history
  const history = await prisma.message.findMany({
    where: { characterId: id },
    orderBy: { createdAt: "asc" },
    take: 20
  })

  // ❌ ไม่ใช้ OpenAI แล้ว
  const reply = mockAIReply(message, character)

  // ✅ ยังเก็บ DB เหมือนเดิม
  await prisma.message.createMany({
    data: [
      { characterId: id, sender: "user", content: message },
      { characterId: id, sender: "ai", content: reply }
    ]
  })

  res.json({ reply })
})

export default router