import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { PrismaClient } from "@prisma/client"
import chatRoute from "./routes/chat"
import characterRoute from "./routes/character"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const prisma = new PrismaClient()

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb" }))

// 🔥 Serve static files FIRST - images, public assets
app.use("/public", express.static(path.join(__dirname, "../public")))
app.use("/images", express.static(path.join(__dirname, "../public/images")))
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Health check with data verification
app.get("/health", async (req, res) => {
  try {
    const characterCount = await prisma.character.count()
    const messageCount = await prisma.message.count()
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: {
        characters: characterCount,
        messages: messageCount
      }
    })
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Database connection failed"
    })
  }
})

// Initialize database on startup
app.get("/init", async (req, res) => {
  try {
    const count = await prisma.character.count()
    if (count === 0) {
      console.log("📌 Database empty - seeding data...")
      const seed = await import("../prisma/seed")
      res.json({ message: "Database initialized and seeded", status: "success" })
    } else {
      res.json({ message: `Database already has ${count} characters`, status: "ready" })
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to initialize" })
  }
})

// Test endpoint
app.post("/test", (req, res) => {
  console.log("🧪 Test endpoint called")
  console.log("Request body:", req.body)
  res.json({ success: true, message: "Test successful", received: req.body })
})

// Routes
app.use("/character", characterRoute)
app.use("/chat", chatRoute)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.path}` })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("🔴 Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    path: req.path,
    method: req.method
  })
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("⏹️  Shutting down...")
  await prisma.$disconnect()
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`🔄 Init database: http://localhost:${PORT}/init`)
})