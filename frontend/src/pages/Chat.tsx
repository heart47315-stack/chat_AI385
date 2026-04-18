import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Test API connectivity
  useEffect(() => {
    axios
      .post("http://localhost:5000/test", { test: "connection" })
      .then(() => console.log("✅ API connection test passed"))
      .catch(err => console.error("❌ API connection test failed:", err.message))
  }, [])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch character info and message history
  useEffect(() => {
    if (id) {
      // Fetch character
      axios
        .get(`http://localhost:5000/character`)
        .then(res => {
          const char = res.data.find((c: Character) => c.id === id)
          if (char) {
            setCharacter(char)
            console.log("✅ Character loaded:", char)
          } else {
            setError("Character not found")
          }
        })
        .catch(err => {
          console.error("❌ Failed to fetch character:", err)
          setError("Failed to load character - Backend connection error")
        })

      // Fetch message history
      axios
        .get(`http://localhost:5000/chat?characterId=${id}`)
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            const msgs: Message[] = res.data.map((m: any) => ({
              role: m.sender === "user" ? "user" : "ai",
              content: m.content
            }))
            setMessages(msgs)
            console.log("📋 Loaded", msgs.length, "messages")
          }
        })
        .catch(err => {
          console.error("⚠️ Failed to load message history:", err.message)
          // Don't set error as this is optional
        })
    }
  }, [id])

  const send = async () => {
    if (!input.trim()) {
      console.log("⚠️ Empty message")
      return
    }

    if (!id) {
      setError("❌ Character ID is missing")
      console.error("❌ Character ID is undefined:", id)
      return
    }

    setLoading(true)
    setError("")
    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")

    console.log("📤 Sending message:", { message: currentInput, characterId: id })

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: currentInput,
        characterId: id
      })

      console.log("📥 Server response:", res.data)

      const aiMessage: Message = { role: "ai", content: res.data.reply }
      setMessages(prev => [...prev, aiMessage])
    } catch (err: any) {
      console.error("❌ Failed to send message:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      
      setError(err.response?.data?.error || err.message || "Failed to send message")
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1))
    } finally {
      setLoading(false)
    }
  }

  if (!character) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400 mb-2">Loading character...</p>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      {/* Header with Character Info */}
      <div className="border-b border-zinc-700 bg-gradient-to-b from-zinc-900 to-black p-4 shadow-lg shadow-zinc-900/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-purple-400 transition text-2xl duration-200"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{character.name}</h1>
            <p className="text-gray-400 text-sm">{character.description}</p>
            <p className="text-purple-400 text-xs mt-1">💭 {character.scenario}</p>
          </div>
          <img
            src={character.avatar || "https://via.placeholder.com/60"}
            alt={character.name}
            className="w-16 h-16 rounded-lg object-cover border-2 border-purple-500/60 shadow-lg shadow-purple-500/20"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/50 border-b border-red-500 px-4 py-2 text-red-200 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">Start a conversation with {character.name}</p>
            <p className="text-sm mt-2 max-w-md text-center">
              {character.personality}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md transition-all duration-200 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-none shadow-purple-500/20"
                    : "bg-zinc-800 text-gray-100 rounded-bl-none border border-zinc-700 shadow-zinc-900/50"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-700 shadow-md shadow-zinc-900/50">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-700 bg-gradient-to-t from-black to-zinc-900 p-4 shadow-lg shadow-black/50">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setError("")
            }}
            onKeyDown={e => e.key === "Enter" && !loading && send()}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500 transition-all duration-200 shadow-md shadow-zinc-900/50"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/50 disabled:shadow-none"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
