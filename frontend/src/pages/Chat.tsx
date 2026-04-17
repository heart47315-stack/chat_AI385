import { useParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

export default function Chat() {
  const { id } = useParams()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  const send = async () => {
    const res = await axios.post("http://localhost:5000/chat", {
      message: input,
      characterId: id
    })

    setMessages([...messages, { role: "user", content: input }, { role: "ai", content: res.data.reply }])
    setInput("")
  }

  return (
    <div className="p-4">
      <div className="h-[70vh] overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1" />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}
