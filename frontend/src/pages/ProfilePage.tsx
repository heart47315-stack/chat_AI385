import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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
    <div className="bg-[#8b8070] min-h-screen text-white flex flex-col items-center justify-start">
      {/* Container */}
      <div className="w-[400px] flex flex-col h-screen">
        
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="mb-3">
            <span className="text-2xl">👤</span>
            <span className="text-xs text-white/70 font-medium ml-2">PROFILE</span>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col justify-center">
          {profile ? (
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/200?text=Avatar"
                  }}
                />
              </div>

              {/* Profile Info Card */}
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                {/* Username */}
                <div>
                  <p className="text-xs text-white/60 font-medium">Username</p>
                  <p className="text-lg font-bold text-white">{profile.username}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs text-white/60 font-medium">Email</p>
                  <p className="text-sm text-white">{profile.email}</p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => navigate("/create-profile")}
                className="w-full mt-6 px-4 py-3 bg-white/25 hover:bg-white/35 text-white font-semibold rounded-xl transition"
              >
                Edit Profile
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold rounded-xl transition border border-red-500/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-white/60">No profile created yet</p>
              <a
                href="/create-profile"
                className="inline-block px-6 py-3 bg-white/25 hover:bg-white/35 text-white font-semibold rounded-xl transition"
              >
                Create One Now
              </a>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[400px] bg-black/30 backdrop-blur-md rounded-t-3xl px-4 py-3 flex justify-around items-center">
          <a href="/" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">🏠</span>
            <span className="text-xs">Home</span>
          </a>
          <a href="/create-profile" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">➕</span>
            <span className="text-xs">Create</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">❤️</span>
            <span className="text-xs">Favorites</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-white hover:text-white transition group">
            <span className="text-lg group-hover:scale-125 transition">👤</span>
            <span className="text-xs">Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}
