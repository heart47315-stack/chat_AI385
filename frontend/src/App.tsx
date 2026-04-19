import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import CreateCharacter from "./pages/CreateCharacter"
import CreateProfile from "./pages/CreateProfile"
import ProfilePage from "./pages/ProfilePage"
import BottomNav from "./components/BottomNav"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/create-character" element={<CreateCharacter />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}