import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./components/Chat"
import CreateCharacter from "./pages/CreateCharacter"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรก */}
        <Route path="/" element={<Home />} />

        {/* หน้า chat */}
        <Route path="/chat/:id" element={<Chat />} />

        {/* สร้างตัวละคร */}
        <Route path="/create" element={<CreateCharacter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App