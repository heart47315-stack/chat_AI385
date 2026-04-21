import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import PageTransition from "../components/PageTransition"

const API_BASE_URL = "http://localhost:5000" // ✅ FIX PORT

interface Message {
  role: "user" | "ai"
  content: string
}

interface Character {
  id: string | number
  name: string
  description: string
  avatar: string
  personality: string
  scenario: string
}

export default function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [characterLoading, setCharacterLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ✅ test connection
  useEffect(() => {
    axios
      .post(`${API_BASE_URL}/test`, { test: "connection" })
      .then(() => console.log("✅ API OK"))
      .catch(() => console.log("❌ API FAIL"))
  }, [])

  // ✅ auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ✅ load character + chat history
  useEffect(() => {
    if (!id) return

    // 🔥 โหลดตัวละคร
    axios
      .get(`${API_BASE_URL}/character`)
      .then(res => {
        const char = res.data.find((c: Character) => String(c.id) === String(id)) // ✅ FIX ID

        if (char) {
          setCharacter(char)
        } else {
          setError("ไม่พบตัวละคร")
        }
      })
      .catch(() => {
        setError("โหลดตัวละครล้มเหลว (Backend ไม่ทำงาน)")
      })
      .finally(() => setCharacterLoading(false))

    // 🔥 โหลด chat history
    axios
      .get(`${API_BASE_URL}/chat?characterId=${id}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          const msgs: Message[] = res.data.map((m: any): Message => ({
            role: m.sender === "user" ? "user" : "ai", // ✅ FIX TYPE
            content: String(m.content) // ✅ FIX TYPE
          }))
          setMessages(msgs)
        }
      })
      .catch(() => {
        console.log("ไม่มี chat history")
      })

  }, [id])

  // ✅ send message
  const send = async () => {
    if (!input.trim() || !id) return

    setLoading(true)
    setError("")

    const userMessage: Message = {
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])

    const text = input
    setInput("")

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        message: text,
        characterId: id
      })

      if (!res.data?.reply) {
        throw new Error("ไม่มี reply")
      }

      const aiMessage: Message = {
        role: "ai",
        content: String(res.data.reply)
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (err) {
      setError("ส่งข้อความไม่สำเร็จ")
      setMessages(prev => prev.slice(0, -1)) // rollback
    } finally {
      setLoading(false)
    }
  }

  // ⏳ loading
  if (characterLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center text-white">
          กำลังโหลด...
        </div>
      </PageTransition>
    )
  }

  // ❌ not found
  if (!character) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
          <h1>❌ ไม่พบตัวละคร</h1>
          <p>{error}</p>
          <button onClick={() => navigate("/")}>← กลับ</button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col text-white bg-black">

        {/* HEADER */}
        <div className="p-4 border-b">
          <h1>{character.name}</h1>
          <p className="text-sm text-gray-400">{character.description}</p>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <div className="inline-block bg-gray-800 px-3 py-2 rounded">
                {msg.content}
              </div>
            </div>
          ))}

          {loading && <div>AI กำลังพิมพ์...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 flex gap-2 border-t">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            className="flex-1 bg-gray-800 px-3 py-2 rounded outline-none"
            placeholder={`พิมพ์ข้อความถึง ${character.name}...`}
            disabled={loading}
          />

          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            ส่ง
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-400 text-center pb-2">
            {error}
          </div>
        )}

      </div>
    </PageTransition>
  )
}