import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (_, res) => {
  const data = await prisma.character.findMany()
  res.json(data)
})

router.post("/", async (req, res) => {
  const c = await prisma.character.create({ data: req.body })
  res.json(c)
})
router.post("/", async (req, res) => {
  const data = await prisma.character.create({
    data: req.body
  })
  res.json(data)
})
export default router