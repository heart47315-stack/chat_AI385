import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

type Message = {
  text: string
  sender: "user" | "ai"
}

export default function Chat() {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  // 🔽 auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const sendMessage = async () => {
    if (!input.trim()) return

    // ❗ กัน id undefined
    if (!id) {
      alert("No character id")
      return
    }

    const userMsg: Message = { text: input, sender: "user" }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    try {
      // ✅ ใช้ proxy (ไม่ต้อง localhost:5000)
      const res = await axios.post(`/chat/${id}`, {
        message: input
      })

      const aiMsg: Message = {
        text: res.data.reply,
        sender: "ai"
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error("API ERROR:", err)

      // ❗ fallback
      setMessages(prev => [
        ...prev,
        { text: "Error ติดต่อ server ไม่ได้", sender: "ai" }
      ])
    }

    setTyping(false)
    setInput("")
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">

      {/* 💬 Chat */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 ${
              m.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-xl max-w-xs ${
                m.sender === "user"
                  ? "bg-blue-500"
                  : "bg-zinc-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <p className="text-gray-400 text-sm">Typing...</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 🔽 Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 bg-zinc-900 rounded text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage()
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  )
}