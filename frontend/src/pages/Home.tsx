import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Home() {
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get("http://localhost:5000/character")
      .then(res => {
        setCharacters(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch characters:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="px-6 py-8 border-b border-zinc-800 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">🔥 Characters</h1>
          <p className="text-gray-400">Meet and chat with unique AI characters</p>
        </div>
        <Link
          to="/create-character"
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/50"
        >
          ✨ Create Character
        </Link>
      </div>

      {/* Characters Grid */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-400">Loading characters...</p>
          </div>
        ) : characters.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-400">No characters found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((c: any) => (
              <Link
                to={`/chat/${c.id}`}
                key={c.id}
                className="card-hover group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 hover:border-purple-400 shadow-lg"
              >
                {/* Image Container - 🎭 Emphasized */}
                <div className="relative h-56 overflow-hidden bg-zinc-800">
                  <img
                    src={c.avatar || "https://via.placeholder.com/300x300?text=" + c.name}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 relative z-10">
                  <h2 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">{c.name}</h2>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{c.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {c.tags &&
                      c.tags.split(",").map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-purple-900/50 border border-purple-500/50 rounded-full text-purple-200 hover:bg-purple-800/50 transition-colors duration-200"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>

                  {/* NSFW Badge */}
                  {c.isNSFW && (
                    <div className="flex items-center gap-1 text-xs text-red-400 mb-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      NSFW
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-2 border-t border-zinc-700">
                    <div className="text-sm font-semibold text-purple-400 group-hover:text-purple-200 transition-colors duration-300">
                      Start Chat →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}