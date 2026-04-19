import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const navItems = [
  { icon: "🏠", label: "Home", path: "/" },
  { icon: "💬", label: "Chat", path: "/chat/1" }, // Default chat
  { icon: "➕", label: "Create", path: "/create-character" },
  { icon: "👤", label: "Profile", path: "/profile" },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/10 z-50"
    >
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path))

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-full h-full group"
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-t-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 relative z-10 transition-colors duration-300 ${
                    isActive ? "text-blue-400" : "text-white/60 group-hover:text-white/80"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-xs font-medium tracking-tight ${
                    isActive ? "text-blue-400" : "text-white/60"
                  }`}>
                    {item.label}
                  </span>
                </motion.div>

                {/* Top Border Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute top-0 left-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-b-full"
                    style={{ x: "-50%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
