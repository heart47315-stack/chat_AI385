import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./COMPONENTS/Chat"
import CreateCharacter from "./pages/CreateCharacter"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/create" element={<CreateCharacter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App