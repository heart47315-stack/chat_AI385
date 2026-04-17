import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import CreateCharacter from "./pages/CreateCharacter"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/create-character" element={<CreateCharacter />} />
      </Routes>
    </BrowserRouter>
  )
}