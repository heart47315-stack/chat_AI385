import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import Home from "./pages/Home"
import Chat from "./pages/Chat"
import CreateCharacter from "./pages/CreateCharacter"
import CreateProfile from "./pages/CreateProfile"
import ProfilePage from "./pages/ProfilePage"
import BottomNav from "./components/BottomNav"

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/create-character" element={<CreateCharacter />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* FIX: ใช้ height เต็มจอ + flex layout ถูกต้อง */}
      <div className="h-screen flex flex-col bg-slate-900">

        {/* FIX: ห้าม overflow-hidden */}
        <div className="flex-1 overflow-y-auto">
          <AnimatedRoutes />
        </div>

        {/* Bottom nav fix อยู่ล่างเสมอ */}
        <BottomNav />

      </div>
    </BrowserRouter>
  )
}