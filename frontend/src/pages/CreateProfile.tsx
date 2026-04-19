import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Layout from "../components/Layout"
import PageTransition from "../components/PageTransition"

interface UserProfile {
  username: string
  email: string
  avatar: string
}

export default function CreateProfile() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.avatar.trim()) {
      setError("All fields are required")
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    // Save to localStorage
    const userProfile: UserProfile = {
      username: formData.username,
      email: formData.email,
      avatar: formData.avatar,
    }
    localStorage.setItem("userProfile", JSON.stringify(userProfile))
    
    // Redirect to profile page
    navigate("/profile")
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
      <Layout title="👤 Create Profile" subtitle="Set up your user profile">
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

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="space-y-6"
        >
          {/* Username Field */}
          <motion.div
            custom={0}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              👤 Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username..."
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            custom={1}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
            />
          </motion.div>

          {/* Avatar URL Field */}
          <motion.div
            custom={2}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-white/80 mb-2">
              🖼️ Avatar URL
            </label>
            <input
              type="text"
              name="avatar"
              placeholder="https://..."
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
            />
            {formData.avatar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 rounded-lg overflow-hidden border border-white/20"
              >
                <img
                  src={formData.avatar}
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

          {/* Submit Button */}
          <motion.button
            custom={3}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            ✨ Create Profile
          </motion.button>
        </motion.form>
      </Layout>
    </PageTransition>
  )
}
