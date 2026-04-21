import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import PageTransition from "../components/PageTransition"

const API = "http://localhost:3000" // ✅ FIX PORT

export default function CreateCharacter() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    personality: "",
    scenario: "",
    avatar: "",
    tags: "",
    isNSFW: false
  })

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError("")
  }

  const submit = async () => {
    if (!form.name.trim()) return setError("กรุณาใส่ชื่อตัวละคร")
    if (!form.description.trim()) return setError("กรุณาใส่คำอธิบาย")
    if (!form.personality.trim()) return setError("กรุณาใส่บุคลิกภาพ")
    if (!form.scenario.trim()) return setError("กรุณาใส่สถานการณ์")

    setLoading(true)

    try {
      const res = await axios.post(`${API}/character`, form, {
        timeout: 5000
      })

      console.log("✅ Character created:", res.data)

      navigate("/") // ✅ กลับหน้า Home

    } catch (err: any) {
      console.error("❌ Error:", err)

      if (err.code === "ECONNREFUSED") {
        setError("❌ Backend ไม่ทำงาน (port 3000)")
      } else if (err.response) {
        setError(err.response.data?.error || "Server error")
      } else {
        setError("❌ เชื่อมต่อ API ไม่ได้")
      }

    } finally {
      setLoading(false)
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  }

  return (
    <PageTransition>
      <Layout title="➕ สร้างตัวละคร" subtitle="ออกแบบตัวละคร AI ของคุณเอง">

        {error && (
          <div className="mb-4 text-red-400">{error}</div>
        )}

        <div className="space-y-4">

          <input
            placeholder="ชื่อ"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            className="w-full p-2 text-black"
          />

          <textarea
            placeholder="คำอธิบาย"
            value={form.description}
            onChange={e => handleChange("description", e.target.value)}
            className="w-full p-2 text-black"
          />

          <textarea
            placeholder="บุคลิก"
            value={form.personality}
            onChange={e => handleChange("personality", e.target.value)}
            className="w-full p-2 text-black"
          />

          <textarea
            placeholder="สถานการณ์"
            value={form.scenario}
            onChange={e => handleChange("scenario", e.target.value)}
            className="w-full p-2 text-black"
          />

          <input
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={e => handleChange("avatar", e.target.value)}
            className="w-full p-2 text-black"
          />

          {form.avatar && (
            <img
              src={form.avatar}
              className="w-full h-40 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/400x200"
              }}
            />
          )}

          <input
            placeholder="tags"
            value={form.tags}
            onChange={e => handleChange("tags", e.target.value)}
            className="w-full p-2 text-black"
          />

          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-500 px-4 py-2 text-white w-full"
          >
            {loading ? "กำลังสร้าง..." : "สร้างตัวละคร"}
          </button>

        </div>
      </Layout>
    </PageTransition>
  )
}