import React, { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: number
  index?: number
}

const Chat: React.FC = () => {
  const { id: characterId } = useParams() // ✅ FIX: get characterId from URL

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageCountRef = useRef(0)

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      setIsLoading(lastMsg.sender === "user")
    } else {
      setIsLoading(false)
    }
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 0)
    return () => clearTimeout(timer)
  }, [messages])

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return
      if (!characterId) {
        setError("❌ ไม่พบ characterId")
        return
      }

      setError(null)
      messageCountRef.current += 1

      const userMessage: Message = {
        id: `user-${messageCountRef.current}`,
        text: messageText,
        sender: "user",
        timestamp: Date.now(),
        index: messageCountRef.current,
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        const response = await axios.post(
          "http://localhost:5000/chat",
          {
            message: messageText,
            characterId, // ✅ FIX IMPORTANT
          },
          {
            timeout: 30000,
            headers: { "Content-Type": "application/json" },
          }
        )

        if (!response.data?.reply) {
          throw new Error("Invalid response from server")
        }

        messageCountRef.current += 1

        const aiMessage: Message = {
          id: `ai-${messageCountRef.current}`,
          text: response.data.reply,
          sender: "ai",
          timestamp: Date.now(),
          index: messageCountRef.current,
        }

        setMessages((prev) => [...prev, aiMessage])
      } catch (err) {
        console.error("❌ CHAT ERROR:", err)

        setError("❌ ส่งข้อความไม่สำเร็จ")

        messageCountRef.current += 1

        setMessages((prev) => [
          ...prev,
          {
            id: `error-${messageCountRef.current}`,
            text: "⚠️ Server error / ไม่สามารถส่งข้อความได้",
            sender: "ai",
            timestamp: Date.now(),
            index: messageCountRef.current,
          },
        ])
      }
    },
    [characterId]
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    messageCountRef.current = 0
  }, [])

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">

      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between">
        <h1>💬 Chat</h1>

        {messages.length > 0 && (
          <button onClick={clearChat} className="text-red-400">
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-white/40 mt-10">
            Start chatting...
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              sender={msg.sender}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 text-red-400 text-sm">{error}</div>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  )
}

export default Chat