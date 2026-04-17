import express from "express"
import cors from "cors"
import dotenv from "dotenv"
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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" })
})

app.use("/chat", chatRoute)
app.use("/character", characterRoute)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({ error: err.message || "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})