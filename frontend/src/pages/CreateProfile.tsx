import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

  return (
    <div className="bg-[#8b8070] min-h-screen text-white flex flex-col items-center justify-start">
      {/* Container */}
      <div className="w-[400px] flex flex-col h-screen">
        
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="mb-3">
            <span className="text-2xl">👤</span>
            <span className="text-xs text-white/70 font-medium ml-2">CREATE PROFILE</span>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl bg-white/15 text-white placeholder-white/50 outline-none focus:bg-white/25 focus:ring-2 focus:ring-white/30 transition"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/15 text-white placeholder-white/50 outline-none focus:bg-white/25 focus:ring-2 focus:ring-white/30 transition"
              />
            </div>

            {/* Avatar URL Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Avatar URL</label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 rounded-xl bg-white/15 text-white placeholder-white/50 outline-none focus:bg-white/25 focus:ring-2 focus:ring-white/30 transition"
              />
              {formData.avatar && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={formData.avatar}
                    alt="preview"
                    className="w-20 h-20 rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/100?text=Invalid"
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 px-4 py-3 bg-white/25 hover:bg-white/35 text-white font-semibold rounded-xl transition"
            >
              Create Profile
            </button>
          </form>
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[400px] bg-black/30 backdrop-blur-md rounded-t-3xl px-4 py-3 flex justify-around items-center">
          <a href="/" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">🏠</span>
            <span className="text-xs">Home</span>
          </a>
          <a href="/create-profile" className="flex flex-col items-center gap-1 text-white hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">➕</span>
            <span className="text-xs">Create</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">❤️</span>
            <span className="text-xs">Favorites</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">👤</span>
            <span className="text-xs">Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}
