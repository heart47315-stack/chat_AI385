import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios"

const API_BASE_URL = "http://localhost:5000"

export default function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [character, setCharacter] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  // scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // load character
  useEffect(() => {
    axios.get(`${API_BASE_URL}/character`)
      .then(res => {
        const c = res.data.find((x: any) => x.id === id)
        setCharacter(c)
      })
  }, [id])

  const send = async () => {
    if (!input.trim()) return

    const text = input
    setInput("")

    setMessages(prev => [...prev, { role: "user", content: text }])

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        message: text,
        characterId: id
      })

      setMessages(prev => [
        ...prev,
        { role: "ai", content: res.data.reply }
      ])
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: "ai", content: "error" }
      ])
    }
  }

  return (
    // ❗ สำคัญที่สุด: ห้าม PageTransition / overflow / wrapper ซ้อน
    <div className="h-screen flex flex-col bg-black text-white">

      {/* header */}
      <div className="p-3 border-b">
        <h1>{character?.name || "loading..."}</h1>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <div className="bg-gray-800 p-2 rounded inline-block">
              {m.content}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* 🔥 INPUT (ตรงนี้คือที่หายบ่อยที่สุด) */}
      <div className="p-3 border-t flex gap-2 bg-black">

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          className="flex-1 bg-gray-800 px-3 py-2 rounded text-white"
          placeholder="พิมพ์ข้อความ..."
        />

        <button
          onClick={send}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          ส่ง
        </button>

      </div>

    </div>
  )
}