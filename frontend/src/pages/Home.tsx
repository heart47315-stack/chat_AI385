import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Home() {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/character").then(res => setCharacters(res.data))
  }, [])

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {characters.map((c: any) => (
        <Link to={`/chat/${c.id}`} key={c.id} className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-white">{c.name}</h2>
          <p className="text-gray-400">{c.description}</p>
        </Link>
      ))}
    </div>
  )
}