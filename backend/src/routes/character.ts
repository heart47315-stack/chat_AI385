import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
  const characters = await prisma.character.findMany()
  res.json(characters)
})

router.post("/", async (req, res) => {
  const data = req.body
  const character = await prisma.character.create({ data })
  res.json(character)
})

export default router