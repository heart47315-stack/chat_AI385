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

// Get message history
router.get("/", async (req: Request, res: Response) => {
  try {
    const characterId = req.query.characterId as string

    if (!characterId) {
      return res.status(400).json({ error: "Missing characterId" })
    }

    const messages = await prisma.message.findMany({
      where: { characterId },
      orderBy: { createdAt: "asc" }
    })

    console.log("📋 Retrieved", messages.length, "messages for character", characterId)

    res.json(messages)
  } catch (error) {
    console.error("❌ Failed to get messages:", error)
    res.status(500).json({ error: "Failed to get message history" })
  }
})

// Demo responses (when OpenAI fails or for testing)
const demoResponses: Record<string, string[]> = {
  default: [
    "That's interesting! Tell me more...",
    "I love that idea!",
    "You're absolutely right!",
    "I couldn't agree more!",
    "That's fascinating!"
  ]
}

// Send chat message
router.post("/", async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, characterId } = req.body

    console.log("📤 Received chat request:", { message, characterId })

    if (!message || !characterId) {
      console.error("❌ Missing required fields:", { message: !!message, characterId: !!characterId })
      return res.status(400).json({ error: "Missing message or characterId" })
    }

    const character = await prisma.character.findUnique({ where: { id: characterId } })

    if (!character) {
      console.error("❌ Character not found:", characterId)
      return res.status(404).json({ error: "Character not found" })
    }

    console.log("✅ Character found:", character.name)

    const history = await prisma.message.findMany({ where: { characterId }, orderBy: { createdAt: "asc" } })

    console.log("📋 Message history count:", history.length)

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

    console.log("🤖 Calling OpenAI with", messages.length, "messages")

    let reply = "";
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 500
      })

      reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
      console.log("✅ OpenAI response received")
    } catch (openaiError: any) {
      console.warn("⚠️ OpenAI failed, using demo mode:", openaiError.message)
      
      // Use demo response when OpenAI fails
      const responses = demoResponses.default;
      reply = responses[Math.floor(Math.random() * responses.length)];
      console.log("📝 Using demo response:", reply)
    }

    await prisma.message.createMany({
      data: [
        { characterId, sender: "user", content: message },
        { characterId, sender: "ai", content: reply }
      ]
    })

    console.log("✅ Messages saved to database")

    res.json({ reply })
  } catch (error: any) {
    console.error("❌ Chat error:", error.message)
    console.error("Error details:", error)
    console.error("Error code:", error.code)
    console.error("Error status:", error.status)
    
    // More specific error messages
    if (error.message?.includes("API")) {
      res.status(500).json({ error: "OpenAI API Error: Check API key and credits" })
    } else if (error.message?.includes("rate limit")) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." })
    } else {
      res.status(500).json({ error: `Failed to process chat request: ${error.message}` })
    }
  }
})

export default router