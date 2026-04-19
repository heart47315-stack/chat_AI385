import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import PageTransition from "../components/PageTransition"

const API_BASE_URL = "http://localhost:5000"

interface Message {
  role: "user" | "ai"
  content: string
}

interface Character {
  id: string
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

  useEffect(() => {
    axios
      .post(`${API_BASE_URL}/test`, { test: "connection" })
      .then(() => console.log("✅ API connection test passed"))
      .catch(err => console.error("❌ API connection test failed:", err.message))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (id) {
      console.log("📖 โหลดตัวละครด้วย ID:", id)

      // ดึงตัวละครจาก API
      axios
        .get(`${API_BASE_URL}/character`)
        .then(res => {
          console.log("📋 ได้ตัวละครทั้งหมด:", res.data.length, "ตัว")
          console.log("🔍 ค้นหา character ID:", id)

          const char = res.data.find((c: Character) => c.id === id)
          if (char) {
            console.log("✅ พบตัวละคร:", char.name, "- ID:", char.id)
            setCharacter(char)
          } else {
            console.error("❌ ไม่พบตัวละครด้วย ID:", id)
            console.error("IDs ที่มี:", res.data.map((c: any) => c.id))
            setError("ไม่พบตัวละคร")
          }
        })
        .catch(err => {
          console.error("❌ ดึงตัวละครล้มเหลว:", err.message)
          setError("ล้มเหลวในการโหลดตัวละคร - ไม่มีการเชื่อมต่อ Backend")
        })
        .finally(() => setCharacterLoading(false))

      // ดึงประวัติข้อความ
      console.log("📋 โหลดประวัติข้อความสำหรับ:", id)
      axios
        .get(`${API_BASE_URL}/chat?characterId=${id}`)
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            const msgs: Message[] = res.data.map((m: any) => ({
              role: m.sender === "user" ? "user" : "ai",
              content: m.content
            }))
            setMessages(msgs)
            console.log("📋 โหลด", msgs.length, "ข้อความ")
          }
        })
        .catch(err => {
          console.warn("⚠️ ล้มเหลวในการโหลดประวัติข้อความ:", err.message)
        })
    }
  }, [id])

  const send = async () => {
    console.log("🔍 send() called, input:", input.trim())

    if (!input.trim()) {
      console.log("⚠️ ข้อความว่าง")
      return
    }

    if (!id) {
      setError("❌ Character ID หายไป")
      console.error("❌ Character ID undefined:", id)
      return
    }

    console.log("📝 เตรียมส่ง:", { message: input, characterId: id })
    setLoading(true)
    setError("")

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")

    console.log("📤 ส่งไป API:", { message: currentInput, characterId: id, url: `${API_BASE_URL}/chat` })

    try {
      console.log("🌐 POST ไปที่:", `${API_BASE_URL}/chat`)
      console.log("📦 ข้อมูลขออ:", { message: currentInput, characterId: id })
      
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        message: currentInput,
        characterId: id
      }, {
        timeout: 30000
      })

      console.log("📥 Full response:", res)
      console.log("📥 res.data:", res.data)
      console.log("📥 reply field:", res.data.reply)
      console.log("📥 reply type:", typeof res.data.reply)

      if (!res.data || !res.data.reply) {
        console.error("❌ Response structure:", res.data)
        throw new Error("ไม่มี reply field ในการตอบกลับ")
      }

      const aiMessage: Message = { role: "ai", content: res.data.reply }
      setMessages(prev => [...prev, aiMessage])
      console.log("✅ เพิ่มข้อความ AI สำเร็จ")
    } catch (err: any) {
      console.error("❌ ส่งข้อความล้มเหลว:", err.message)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      console.error("Full error:", err)

      const errorMsg = err.response?.data?.error || err.message || "ส่งข้อความล้มเหลว"
      setError(`❌ ${errorMsg}`)

      // ลบข้อความ user ที่เพิ่ง add
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1))
    } finally {
      setLoading(false)
    }
  }

  if (characterLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full"
          />
        </div>
      </PageTransition>
    )
  }

  if (!character) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            ❌
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">❌ ไม่พบตัวละคร</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition"
          >
            ← กลับไปหน้าตัวละคร
          </motion.button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col text-white pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 bg-black/30 backdrop-blur-2xl border-b border-white/10 py-4 px-4 shadow-lg"
        >
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="text-white/70 hover:text-white transition text-2xl"
            >
              ←
            </motion.button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{character.name}</h1>
              <p className="text-white/60 text-sm truncate">{character.description}</p>
            </div>
            <motion.img
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              src={character.avatar || "https://via.placeholder.com/60"}
              alt={character.name}
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = `https://via.placeholder.com/60?text=${encodeURIComponent(character.name.substring(0, 2))}`
              }}
              className="w-14 h-14 rounded-xl object-cover border-2 border-blue-500/50 shadow-lg shadow-blue-500/20"
            />
          </div>
        </motion.header>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-4 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm backdrop-blur-md"
          >
            ❌ {error}
          </motion.div>
        )}

        {/* Messages Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full pb-32"
        >
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                💬
              </motion.div>
              <p className="text-xl font-semibold">พูดคุยกับ {character.name}</p>
              <p className="text-white/60 text-sm mt-3 max-w-sm">{character.personality}</p>
            </motion.div>
          ) : (
            <motion.div className="space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.role}-${i}-${msg.content.slice(0, 10)}`}
                  initial={{ opacity: 0, x: msg.role === "user" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-xs sm:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl backdrop-blur-md transition-all ${msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white rounded-br-none border border-blue-500/30 shadow-lg shadow-blue-500/20"
                      : "bg-white/10 text-white/90 rounded-bl-none border border-white/20 shadow-lg shadow-black/20"
                      }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                  </motion.div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 px-5 py-3 rounded-2xl rounded-bl-none border border-white/20 backdrop-blur-md">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </motion.div>

        {/* Input Area */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-900 via-slate-800 to-transparent px-4 py-4 backdrop-blur-xl border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => {
                console.log("⌨️ ตัวอักษรใหม่:", e.target.value)
                setInput(e.target.value)
                setError("")
              }}
              onKeyDown={e => {
                console.log("⌨️ keydown event:", e.key)
                if (e.key === "Enter" && !loading) {
                  console.log("🚀 Enter pressed, sending...")
                  send()
                }
              }}
              placeholder={`ส่งข้อความไปยัง ${character.name}...`}
              className="flex-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl px-5 py-3 text-white placeholder-white/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log("🖱️ ปุ่มส่งถูกกด, loading:", loading, "input:", input.trim())
                send()
              }}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:shadow-none"
            >
              {loading ? "⏳ รอ..." : "📤 ส่ง"}
            </motion.button>
          </div>
        </motion.footer>
      </div>
    </PageTransition>
  )
}
