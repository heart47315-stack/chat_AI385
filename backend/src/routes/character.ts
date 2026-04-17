import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

interface CreateCharacterRequest {
  name: string
  description: string
  personality: string
  scenario: string
  avatar: string
  tags: string
  isNSFW?: boolean
}

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (req: Request, res: Response) => {
  try {
    const characters = await prisma.character.findMany({ orderBy: { createdAt: "desc" } })
    res.json(characters)
  } catch (error) {
    console.error("Character fetch error:", error)
    res.status(500).json({ error: "Failed to fetch characters" })
  }
})

router.post("/", async (req: Request<{}, {}, CreateCharacterRequest>, res: Response) => {
  try {
    const { name, description, personality, scenario, avatar, tags, isNSFW } = req.body

    if (!name || !description || !personality || !scenario || !avatar) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const character = await prisma.character.create({
      data: {
        name,
        description,
        personality,
        scenario,
        avatar,
        tags: tags || "",
        isNSFW: isNSFW || false
      }
    })
    res.json(character)
  } catch (error) {
    console.error("Character creation error:", error)
    res.status(500).json({ error: "Failed to create character" })
  }
})

export default router