import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import PageTransition from "../components/PageTransition"

const API = "http://localhost:5000"

export default function CreateCharacter() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    personality: "",
    scenario: "",
    avatar: "",
    tags: "",
    isNSFW: false
  })

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError("")
  }

  const submit = async () => {
    if (!form.name.trim()) {
      setError("กรุณาใส่ชื่อตัวละคร")
      return
    }
    if (!form.description.trim()) {
      setError("กรุณาใส่คำอธิบาย")
      return
    }
    if (!form.personality.trim()) {
      setError("กรุณาใส่บุคลิกภาพ")
      return
    }
    if (!form.scenario.trim()) {
      setError("กรุณาใส่สถานการณ์")
      return
    }
    if (!form.avatar.trim()) {
      setError("กรุณาใส่ URL รูปภาพ")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(`${API}/character`, form)
      console.log("✅ Character created:", res.data)
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create character")
      console.error("❌ Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  }

  return (
    <PageTransition>
      <Layout title="➕ Create Character" subtitle="Design a new AI character">
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 backdrop-blur-md"
          >
            ❌ {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="space-y-5"
        >
          {/* Name Field */}
          <motion.div
            custom={0}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              🎭 Character Name
            </label>
            <input
              type="text"
              placeholder="Enter character name..."
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
            />
          </motion.div>

          {/* Description Field */}
          <motion.div
            custom={1}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              📝 Description
            </label>
            <textarea
              placeholder="Brief description of the character..."
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition resize-none"
            />
          </motion.div>

          {/* Personality Field */}
          <motion.div
            custom={2}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              🧠 Personality
            </label>
            <textarea
              placeholder="How does this character behave and think?"
              value={form.personality}
              onChange={e => handleChange("personality", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition resize-none"
            />
          </motion.div>

          {/* Scenario Field */}
          <motion.div
            custom={3}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              🎬 Scenario
            </label>
            <textarea
              placeholder="What's the setting and context?"
              value={form.scenario}
              onChange={e => handleChange("scenario", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition resize-none"
            />
          </motion.div>

          {/* Avatar URL Field */}
          <motion.div
            custom={4}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              🖼️ Avatar URL
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={form.avatar}
              onChange={e => handleChange("avatar", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
            />
            {form.avatar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 rounded-lg overflow-hidden border border-white/20"
              >
                <img
                  src={form.avatar}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x200"
                  }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Tags Field */}
          <motion.div
            custom={5}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              🏷️ Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. friendly, fantasy, developer..."
              value={form.tags}
              onChange={e => handleChange("tags", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
            />
          </motion.div>

          {/* NSFW Toggle */}
          <motion.div
            custom={6}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md"
          >
            <label className="flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={form.isNSFW}
                onChange={e => handleChange("isNSFW", e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
              />
              <span className="font-semibold text-white/80">
                🔞 Mark as NSFW
              </span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            custom={7}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            {loading ? "Creating..." : "✨ Create Character"}
          </motion.button>
        </motion.div>
      </Layout>
    </PageTransition>
  )
}