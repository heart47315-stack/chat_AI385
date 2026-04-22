import express from "express"
import axios from "axios"

const router = express.Router()

// mock DB (ต้องมีตัวนี้อยู่จริง)
let characters = [
  {
    id: "1",
    name: "Luna",
    personality: "sweet, caring",
    scenario: "girlfriend"
  }
]

// 🔥 CHAT ROUTE (FIXED 100%)
router.post("/chat", async (req, res) => {
  try {
    const { message, characterId } = req.body

    if (!message || !characterId) {
      return res.status(400).json({ error: "message + characterId required" })
    }

    const character = characters.find((c) => c.id === String(characterId))

    if (!character) {
      return res.status(404).json({ error: "Character not found" })
    }

    const messages = [
      {
        role: "system",
        content: `You are ${character.name}.
Personality: ${character.personality}
Scenario: ${character.scenario}
Be natural, friendly, and stay in character.`
      },
      {
        role: "user",
        content: message
      }
    ]

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const reply = response.data?.choices?.[0]?.message?.content

    return res.json({
      reply: reply || "ฉันยังคิดไม่ออกเลย 😊"
    })

  } catch (err: any) {
    console.error("CHAT ERROR:", err?.response?.data || err.message)

    return res.status(500).json({
      reply: "ตอนนี้ระบบมีปัญหา ลองใหม่อีกครั้งนะ 😊"
    })
  }
})

export default router