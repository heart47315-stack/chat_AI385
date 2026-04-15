import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import chatRoute from "./routes/chat"
import characterRoute from "./routes/character"
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/chat", chatRoute)
app.use("/character", characterRoute)

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000")
})