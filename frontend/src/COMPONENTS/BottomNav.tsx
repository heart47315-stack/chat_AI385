import { Link, useLocation } from "react-router-dom"

export default function BottomNav() {
  const { pathname } = useLocation()

  const item = (to: string, label: string) => (
    <Link
      to={to}
      className={`flex-1 text-center py-3 ${pathname === to ? "text-blue-400" : "text-white/60"
        }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="sticky bottom-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 flex">
      {item("/", "Home")}
      {item("/create-character", "Create")}
      {item("/profile", "Profile")}
    </div>
  )
}