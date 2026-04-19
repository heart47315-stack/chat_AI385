import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"

export default function Home() {
  const [characters, setCharacters] = useState<any[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const location = useLocation()

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
    <div className="bg-gradient-to-br from-[#a89f91] via-[#9c927f] to-[#8b8070] min-h-screen text-white flex justify-center">
      
      {/* 📱 Main Container */}
      <div className="w-[400px] min-h-screen bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col">

        {/* 🔝 Header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-sm font-semibold tracking-wide text-white/80">
                CHARACTERS
              </span>
            </div>
          </div>

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/30 transition text-sm"
          />
        </div>

        {/* 📦 Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-32">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white animate-spin rounded-full" />
                <p className="text-white/60 text-sm">Loading...</p>
              </div>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-white/60">No characters found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredCharacters.map((c: any) => (
                <Link
                  to={`/chat/${c.id}`}
                  key={c.id}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition duration-300">
                    
                    {/* 🖼 Image */}
                    <div className="relative w-full h-[170px] overflow-hidden">
                      <img
                        src={c.avatar || `https://via.placeholder.com/300x300?text=${c.name}`}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* 🔞 Badge */}
                      {c.isNSFW && (
                        <div className="absolute top-2 right-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded-full">
                          18+
                        </div>
                      )}
                    </div>

                    {/* 📝 Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm tracking-wide line-clamp-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-1">
                        {c.description}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 🔻 Bottom Nav */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[360px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex justify-around items-center shadow-xl">

          <Link to="/" className={`flex flex-col items-center text-xs ${location.pathname === "/" ? "text-white" : "text-white/50"}`}>
            <span className="text-lg">🏠</span>
            Home
          </Link>

          <Link to="/create-character" className={`flex flex-col items-center text-xs ${location.pathname === "/create-character" ? "text-white" : "text-white/50"}`}>
            <span className="text-lg">➕</span>
            Create
          </Link>

          <button className="flex flex-col items-center text-xs text-white/50">
            <span className="text-lg">❤️</span>
            Fav
          </button>

          <Link to="/profile" className={`flex flex-col items-center text-xs ${location.pathname === "/profile" ? "text-white" : "text-white/50"}`}>
            <span className="text-lg">👤</span>
            Profile
          </Link>

        </div>
      </div>
    </div>
  )
}