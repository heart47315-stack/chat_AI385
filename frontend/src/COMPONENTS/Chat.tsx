import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
  index?: number;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(0);

  // Track loading state
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      setIsLoading(lastMsg.sender === "user");
    } else {
      setIsLoading(false);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return;

      setError(null);
      messageCountRef.current += 1;

      const userMessage: Message = {
        id: `user-${messageCountRef.current}`,
        text: messageText,
        sender: "user",
        timestamp: Date.now(),
        index: messageCountRef.current,
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await axios.post(
          "http://localhost:5000/chat",
          { message: messageText },
          {
            timeout: 30000,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.data?.reply) {
          throw new Error("Invalid response from server");
        }

        messageCountRef.current += 1;

        const aiMessage: Message = {
          id: `ai-${messageCountRef.current}`,
          text: response.data.reply,
          sender: "ai",
          timestamp: Date.now(),
          index: messageCountRef.current,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        let errorMessage = "เกิด error จาก server";

        if (axios.isAxiosError(err)) {
          if (err.code === "ECONNABORTED") {
            errorMessage = "⏱️ Request timeout - Server ไม่ตอบ";
          } else if (err.response?.status === 500) {
            errorMessage = "🔴 Server error (500) - ตรวจสอบ API key";
          } else if (err.response?.status === 400) {
            errorMessage = "❌ Bad request (400)";
          } else if (!err.response) {
            errorMessage = "🔌 ไม่สามารถเชื่อมต่อ server";
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        messageCountRef.current += 1;

        const errorMsg: Message = {
          id: `error-${messageCountRef.current}`,
          text: `⚠️ ${errorMessage}`,
          sender: "ai",
          timestamp: Date.now(),
          index: messageCountRef.current,
        };

        setMessages((prev) => [...prev, errorMsg]);
      }
    },
    []
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    messageCountRef.current = 0;
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-xl border-b border-blue-500/20 p-4 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-pulse">🤖</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Chat Assistant
              </h1>
              <p className="text-blue-300 text-sm font-medium">
                {isLoading ? "🌀 AI is thinking..." : "✨ Ready to chat"}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all duration-200 text-sm font-medium border border-red-500/30"
            >
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-5xl mx-auto w-full scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-6">
              <div className="text-7xl">💬</div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Start a Conversation
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Type a message below and press Enter to chat with AI
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <MessageBubble
                key={`${msg.sender}-${msg.index}-${idx}`}
                text={msg.text}
                sender={msg.sender}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-gradient-to-r from-red-500/30 to-red-600/20 border border-red-500/50 text-red-200 rounded-lg text-sm font-medium backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Input Area */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;