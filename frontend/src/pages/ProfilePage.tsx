import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Layout from "../components/Layout"
import PageTransition from "../components/PageTransition"

interface UserProfile {
  username: string
  email: string
  avatar: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userProfile")
    setProfile(null)
    navigate("/")
  }

  return (
    <PageTransition>
      <Layout title="👤 Profile" subtitle="Your user profile">
        {profile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="max-w-md mx-auto space-y-6"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-40 h-40 rounded-2xl object-cover border-4 border-blue-500/50 shadow-2xl shadow-blue-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/200?text=Avatar"
                  }}
                />
              </div>
            </motion.div>

            {/* Profile Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4"
            >
              {/* Username */}
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Username
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {profile.username}
                </p>
              </div>

              {/* Email */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-base text-white/80 mt-1 break-all">
                  {profile.email}
                </p>
              </div>
            </motion.div>

            {/* Stats (Optional) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-3"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                <p className="text-2xl font-bold text-blue-400">42</p>
                <p className="text-xs text-white/60 mt-1">Chats</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                <p className="text-2xl font-bold text-cyan-400">12</p>
                <p className="text-xs text-white/60 mt-1">Favorites</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                <p className="text-2xl font-bold text-purple-400">7</p>
                <p className="text-xs text-white/60 mt-1">Created</p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/create-profile")}
                className="w-full py-3 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                ✏️ Edit Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500/70 text-red-300 font-semibold rounded-lg transition-all duration-300"
              >
                🚪 Logout
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              👤
            </motion.div>
            <p className="text-xl font-semibold text-white mb-2">
              No profile yet
            </p>
            <p className="text-white/60 mb-6">Create your profile to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/create-profile")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              ✨ Create Profile
            </motion.button>
          </motion.div>
        )}
      </Layout>
    </PageTransition>
  )
}
