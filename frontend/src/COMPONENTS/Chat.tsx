import { useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

type Message = {
  text: string
  sender: "user" | "ai"
}

export default function Chat() {
  const { id } = useParams() // ✅ ใช้ id จาก URL
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = { text: input, sender: "user" }
    setMessages(prev => [...prev, userMsg])

    setTyping(true)

    try {
      const res = await axios.post(
        `http://localhost:5000/chat/${id}`, // ✅ dynamic
        { message: input }
      )

      const aiMsg: Message = {
        text: res.data.reply,
        sender: "ai"
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error("API ERROR:", err)
    }

    setTyping(false)
    setInput("")
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">

      {/* 💬 Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 ${
              m.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div className="inline-block bg-zinc-800 px-4 py-2 rounded-xl max-w-xs">
              {m.text}
            </div>
          </div>
        ))}

        {typing && <p className="text-gray-400">Typing...</p>}
      </div>

      {/* 🔽 Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 bg-zinc-900 rounded text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage() // ✅ กด Enter ส่งได้
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}