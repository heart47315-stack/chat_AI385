import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import Layout from "../components/Layout"
import PageTransition from "../components/PageTransition"

const API_BASE_URL = "http://localhost:5000"

export default function Home() {
  const [characters, setCharacters] = useState<any[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // 🔥 Fetch characters
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await axios.get(`${API_BASE_URL}/character`)
        console.log("🔥 API RESPONSE:", res.data)

        if (!Array.isArray(res.data)) {
          throw new Error("API ไม่ส่ง array")
        }

        setCharacters(res.data)
        setFilteredCharacters(res.data)
      } catch (err) {
        console.error("❌ API ERROR:", err)

        // fallback กันหน้าว่าง
        const mockData = [
          {
            id: 1,
            name: "Vincent",
            description: "Cold mafia boss",
            avatar: "https://via.placeholder.com/300x200?text=Vincent",
            tags: "Mafia",
          },
        ]

        setCharacters(mockData)
        setFilteredCharacters(mockData)
        setError("⚠️ backend อาจไม่ทำงาน")
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

        {/* 🔥 ปุ่มสร้างตัวละคร (สำคัญ) */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full mr-3 px-4 py-2 rounded-lg bg-white/10 text-white outline-none"
          />

          <Link
            to="/create"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap"
          >
            + สร้าง
          </Link>
        </div>

        {/* ❌ Error */}
        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
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

              // ✅ FIX รูป (สำคัญ)
              const imageSrc =
                character.avatar ||
                (character.image
                  ? `${API_BASE_URL}/images/${character.image}`
                  : null) ||
                `https://via.placeholder.com/300x200?text=${encodeURIComponent(character.name)}`

              return (
                <motion.div key={character.id}>
                  <Link to={`/chat/${character.id}`}>
                    <div className="bg-white/10 rounded-xl overflow-hidden">

                      {/* 🖼 IMAGE */}
                      <div className="h-40 bg-gray-800">
                        <img
                          src={imageSrc}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement
                            img.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(character.name)}`
                          }}
                        />
                      </div>

                      {/* 📄 CONTENT */}
                      <div className="p-3">
                        <h3 className="text-white font-bold text-sm">
                          {character.name}
                        </h3>
                        <p className="text-white/60 text-xs">
                          {character.description}
                        </p>

                        {character.tags && (
                          <span className="text-xs text-blue-300">
                            {character.tags}
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