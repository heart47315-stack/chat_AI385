import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
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

  // Fetch character info
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/character`)
        .then(res => {
          const char = res.data.find((c: Character) => c.id === id)
          setCharacter(char)
        })
        .catch(err => console.error("Failed to fetch character:", err))
    }
  }, [id])

  const send = async () => {
    if (!input.trim()) return

    setLoading(true)
    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
        characterId: id
      })

      const aiMessage: Message = { role: "ai", content: res.data.reply }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error("Failed to send message:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!character) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading character...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      {/* Header with Character Info */}
      <div className="border-b border-zinc-700 bg-gradient-to-b from-zinc-900 to-black p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white transition text-2xl"
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
            className="w-16 h-16 rounded-lg object-cover border border-purple-500/50"
          />
        </div>
      </div>

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
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-zinc-800 text-gray-100 rounded-bl-none border border-zinc-700"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-700">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-700 bg-gradient-to-t from-black to-zinc-900 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && send()}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
