import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Home() {
  const [characters, setCharacters] = useState<any[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:5000/character")
      .then(res => {
        setCharacters(res.data)
        setFilteredCharacters(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch characters:", err)
        setLoading(false)
      })
  }, [])

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    const filtered = characters.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      (c.tags && c.tags.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredCharacters(filtered)
  }

  return (
    <div className="bg-[#8b8070] min-h-screen text-white flex flex-col items-center justify-start">
      {/* 📱 Container - Locked Width 400px */}
      <div className="w-[400px] flex flex-col h-screen">

        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          {/* Title */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xs text-white/70 font-medium">CHARACTERS</span>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-white/15 text-white placeholder-white/60 outline-none focus:bg-white/25 transition text-sm"
          />
        </div>

        {/* Content - Scrollable with padding for navbar */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-3">
                  <div className="absolute inset-0 rounded-full border-3 border-white/20 border-t-white/80 animate-spin" />
                </div>
                <p className="text-sm text-white/60">Loading...</p>
              </div>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <p className="text-white/60">No characters found</p>
              </div>
            </div>
          ) : (
            /* Grid - 2 Columns, Fixed */
            <div className="grid grid-cols-2 gap-3">
              {filteredCharacters.map((c: any) => (
                <Link
                  to={`/chat/${c.id}`}
                  key={c.id}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="bg-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:bg-white/15 transition">
                    {/* Image - Fixed Height */}
                    <div className="relative w-full h-[160px] overflow-hidden bg-white/5">
                      <img
                        src={c.avatar || "https://via.placeholder.com/300x300?text=" + c.name}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* NSFW Badge */}
                      {c.isNSFW && (
                        <div className="absolute top-2 right-2 bg-red-600/95 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-300 rounded-full animate-pulse" />
                          18+
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2">
                      <h3 className="font-bold text-sm text-white line-clamp-1">{c.name}</h3>
                      <p className="text-xs text-white/70 line-clamp-1">{c.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Nav - Fixed */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[400px] bg-black/30 backdrop-blur-md rounded-t-3xl px-4 py-3 flex justify-around items-center">
          <a href="/" className="flex flex-col items-center gap-1 text-white hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">🏠</span>
            <span className="text-xs">Home</span>
          </a>
          <a href="/create-profile" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">➕</span>
            <span className="text-xs">Create</span>
          </a>
          <button className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">❤️</span>
            <span className="text-xs">Favorites</span>
          </button>
          <a href="/profile" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">👤</span>
            <span className="text-xs">Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}