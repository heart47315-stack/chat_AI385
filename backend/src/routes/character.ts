import { Router, Request, Response } from "express"
const { PrismaClient } = require('@prisma/client');


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

// Get all characters with proper error handling
router.get("/", async (req: Request, res: Response) => {
  try {
    console.log("📋 Fetching all characters...")
    const characters = await prisma.character.findMany({
      orderBy: { createdAt: "desc" }
    })

    console.log(`✅ Found ${characters.length} characters`)

    // If no characters, try to seed
    if (characters.length === 0) {
      console.log("⚠️  No characters found. Attempting to seed database...")
      try {
        // Import and run seed
        const seedModule = await import("../../prisma/seed.js").catch(() => null)
        if (seedModule) {
          await seedModule.default?.()
        }
        // Re-fetch after seeding
        const seededCharacters = await prisma.character.findMany({
          orderBy: { createdAt: "desc" }
        })
        console.log(`✅ Seeded ${seededCharacters.length} characters`)
        return res.json(seededCharacters)
      } catch (seedError) {
        console.error("Seed attempt failed:", seedError)
      }
    }

    res.json(characters)
  } catch (error) {
    console.error("❌ Character fetch error:", error)
    res.status(500).json({
      error: "Failed to fetch characters",
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

// Get single character
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    console.log(`📖 Fetching character ${id}...`)

    const character = await prisma.character.findUnique({
      where: { id: String(id) },
      include: { messages: { take: 10, orderBy: { createdAt: "desc" } } }
    })

    if (!character) {
      return res.status(404).json({ error: "Character not found" })
    }

    console.log(`✅ Found character: ${character.name}`)
    res.json(character)
  } catch (error) {
    console.error("❌ Character fetch error:", error)
    res.status(500).json({
      error: "Failed to fetch character",
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

// Create new character
router.post("/", async (req: Request<{}, {}, CreateCharacterRequest>, res: Response) => {
  try {
    console.log("➕ Creating new character...")
    const { name, description, personality, scenario, avatar, tags, isNSFW } = req.body

    if (!name || !description || !personality || !scenario) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "description", "personality", "scenario"]
      })
    }

    const character = await prisma.character.create({
      data: {
        name,
        description,
        personality,
        scenario,
        avatar: avatar || `https://via.placeholder.com/400x300?text=${encodeURIComponent(name)}`,
        tags: tags || "",
        isNSFW: isNSFW || false
      }
    })

    console.log(`✅ Created character: ${character.name} (${character.id})`)
    res.status(201).json(character)
  } catch (error) {
    console.error("❌ Character creation error:", error)
    res.status(500).json({
      error: "Failed to create character",
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

// Update character
router.put("/:id", async (req: Request<{ id: string }, {}, Partial<CreateCharacterRequest>>, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    console.log(`✏️  Updating character ${id}...`)
    const updates = req.body

    const character = await prisma.character.update({
      where: { id: String(id) },
      data: updates
    })

    console.log(`✅ Updated character: ${character.name}`)
    res.json(character)
  } catch (error) {
    console.error("❌ Character update error:", error)
    res.status(500).json({
      error: "Failed to update character",
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

// Delete character
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    console.log(`🗑️  Deleting character ${id}...`)

    await prisma.character.delete({
      where: { id: String(id) }
    })

    console.log(`✅ Deleted character`)
    res.json({ success: true, message: "Character deleted" })
  } catch (error) {
    console.error("❌ Character delete error:", error)
    res.status(500).json({
      error: "Failed to delete character",
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

export default router