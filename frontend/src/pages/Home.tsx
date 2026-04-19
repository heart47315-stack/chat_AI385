import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import Layout from "../components/Layout"
import PageTransition from "../components/PageTransition"

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <PageTransition>
      <Layout title="🔥 Characters" subtitle="Select a character to chat with">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition duration-300"
          />
        </motion.div>

        {/* Characters Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full"
              />
              <p className="text-white/60">Loading characters...</p>
            </div>
          </motion.div>
        ) : filteredCharacters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <div className="text-center">
              <p className="text-white/60 text-lg">😕 No characters found</p>
              <p className="text-white/40 text-sm mt-2">Try a different search</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCharacters.map((character: any) => (
              <motion.div
                key={character.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/chat/${character.id}`}
                  className="block h-full group"
                >
                  <div className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition duration-300 flex flex-col">
                    {/* Image Container */}
                    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                      <motion.img
                        src={character.avatar || `https://via.placeholder.com/400x300?text=${character.name}`}
                        alt={character.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Badge */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="absolute top-3 right-3"
                      >
                        {character.isNSFW && (
                          <div className="bg-red-600/90 text-white text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-md border border-red-400/30">
                            18+
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-blue-400 transition">
                          {character.name}
                        </h3>
                        <p className="text-white/70 text-sm mt-2 line-clamp-2">
                          {character.description}
                        </p>
                      </div>

                      {/* Tags */}
                      {character.tags && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {character.tags.split(",").slice(0, 2).map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold text-sm transition duration-300"
                      >
                        Start Chat →
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Layout>
    </PageTransition>
  )
}