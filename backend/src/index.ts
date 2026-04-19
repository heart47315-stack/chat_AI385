import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import chatRoute from "./routes/chat"
import characterRoute from "./routes/character"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}))
app.use(express.json())

// Serve static files
app.use(express.static(path.join(__dirname, "../public")))

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Test endpoint
app.post("/test", (req, res) => {
  console.log("🧪 Test endpoint called")
  console.log("Request body:", req.body)
  res.json({ success: true, message: "Test successful", received: req.body })
})

app.use("/chat", chatRoute)
app.use("/character", characterRoute)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("🔴 Unhandled error:", err.message)
  console.error("Stack:", err.stack)
  res.status(err.status || 500).json({ error: err.message || "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})