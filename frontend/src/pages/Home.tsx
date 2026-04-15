import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

type Character = {
  id: string
  name: string
  description: string
  avatar: string
  tags: string
}

const API = "http://localhost:5000"

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [filter, setFilter] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API}/character`).then(res => setCharacters(res.data))
  }, [])

  const filtered = characters.filter(c =>
    c.tags.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="bg-black min-h-screen text-white">

      {/* 🔥 Header */}
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <h1 className="text-xl font-bold">AI Characters</h1>

        <button
          onClick={() => navigate("/create")}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          + Create
        </button>
      </div>

      {/* 🔍 Filter */}
      <div className="p-4">
        <input
          placeholder="ค้นหา tag เช่น romance, horror..."
          className="w-full p-2 bg-zinc-900 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* 🧠 Character Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {filtered.map(c => (
          <div
            key={c.id}
            onClick={() => navigate(`/chat/${c.id}`)}
            className="bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition"
          >
            {/* 🖼 Avatar */}
            <img
              src={c.avatar || "https://via.placeholder.com/300"}
              className="w-full h-40 object-cover"
            />

            {/* 📄 Info */}
            <div className="p-3">
              <h2 className="font-bold">{c.name}</h2>
              <p className="text-sm text-gray-400 line-clamp-2">
                {c.description}
              </p>

              <span className="text-xs text-blue-400">
                #{c.tags}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ❌ ไม่มีข้อมูล */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          ไม่มีตัวละคร
        </p>
      )}
    </div>
  )
}