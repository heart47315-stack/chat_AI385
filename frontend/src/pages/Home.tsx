import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import Layout from "../components/Layout"
import PageTransition from "../components/PageTransition"

const API_BASE_URL = "http://localhost:3000" // ✅ FIX PORT

export default function Home() {
  const [characters, setCharacters] = useState<any[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true)
        setError("")

        console.log("📡 Fetch:", `${API_BASE_URL}/character`)

        const res = await axios.get(`${API_BASE_URL}/character`, {
          timeout: 5000
        })

        // ✅ FIX: กัน API พัง
        const data = Array.isArray(res.data) ? res.data : []

        setCharacters(data)
        setFilteredCharacters(data)

      } catch (err: any) {
        console.error("❌ API ERROR:", err.message)

        // 🔥 fallback data
        const mockData = [
          {
            id: "1",
            name: "Offline AI",
            description: "Backend ยังไม่ทำงาน",
            avatar: "",
            tags: "offline",
          },
        ]

        setCharacters(mockData)
        setFilteredCharacters(mockData)
        setError("⚠️ Backend ไม่ทำงาน (ใช้ข้อมูลจำลอง)")
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [])

  // 🔍 Search
  const handleSearch = (query: string) => {
    setSearchTerm(query)

    const filtered = characters.filter((c) =>
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.description?.toLowerCase().includes(query.toLowerCase()) ||
      c.tags?.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredCharacters(filtered)
  }

  return (
    <PageTransition>
      <Layout title="🔥 ตัวละคร" subtitle="เลือกตัวละครเพื่อแชทกับ AI">

        {/* 🔍 SEARCH + CREATE */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full mr-3 px-4 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Link
            to="/create-character"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl whitespace-nowrap"
          >
            + สร้าง
          </Link>
        </div>

        {/* ❌ Error */}
        {error && (
          <div className="mb-4 text-yellow-400 text-sm">
            {error}
          </div>
        )}

        {/* ⏳ Loading */}
        {loading ? (
          <div className="text-center py-20 text-white/60">
            กำลังโหลด...
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-20 text-white/60">
            ไม่มีตัวละคร
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCharacters.map((character) => {

              const imageSrc =
                character.avatar ||
                (character.image
                  ? `${API_BASE_URL}/images/${character.image}`
                  : null) ||
                `https://placehold.co/300x200?text=${encodeURIComponent(character.name)}`

              return (
                <motion.div
                  key={String(character.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link to={`/chat/${character.id}`}>
                    <div className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-lg border border-white/10 shadow-lg">

                      {/* 🖼 IMAGE */}
                      <div className="h-40 bg-gray-800">
                        <img
                          src={imageSrc}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement
                            img.src = `https://placehold.co/300x200?text=${encodeURIComponent(character.name)}`
                          }}
                        />
                      </div>

                      {/* 📄 CONTENT */}
                      <div className="p-3">
                        <h3 className="text-white font-bold text-sm truncate">
                          {character.name}
                        </h3>
                        <p className="text-white/60 text-xs line-clamp-2">
                          {character.description}
                        </p>

                        {character.tags && (
                          <span className="text-xs text-blue-300">
                            #{character.tags}
                          </span>
                        )}
                      </div>

                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </Layout>
    </PageTransition>
  )
}