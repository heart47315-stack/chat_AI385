import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:5000"

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
    if (!form.name.trim()) {
      setError("กรุณาใส่ชื่อตัวละคร")
      return
    }
    if (!form.description.trim()) {
      setError("กรุณาใส่คำอธิบาย")
      return
    }
    if (!form.personality.trim()) {
      setError("กรุณาใส่บุคลิกภาพ")
      return
    }
    if (!form.scenario.trim()) {
      setError("กรุณาใส่สถานการณ์")
      return
    }
    if (!form.avatar.trim()) {
      setError("กรุณาใส่ URL รูปภาพ")
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API}/character`, form)
      alert("✅ สร้างตัวละครสำเร็จ!")
      navigate("/")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || "❌ เกิดข้อผิดพลาด")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">✨ Create Character</h1>

        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-purple-400 transition text-2xl"
        >
          ←
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* 🧾 FORM */}
        <div className="flex flex-col gap-3">

          <input
            placeholder="Name"
            value={form.name}
            className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={loading}
          />

          <input
            placeholder="Avatar URL"
            value={form.avatar}
            className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            onChange={(e) => handleChange("avatar", e.target.value)}
            disabled={loading}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none"
            rows={3}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={loading}
          />

          <textarea
            placeholder="Personality"
            value={form.personality}
            className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none"
            rows={3}
            onChange={(e) => handleChange("personality", e.target.value)}
            disabled={loading}
          />

          <textarea
            placeholder="Scenario"
            value={form.scenario}
            className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none"
            rows={3}
            onChange={(e) => handleChange("scenario", e.target.value)}
            disabled={loading}
          />

          <input
            placeholder="Tags (romance, horror...)"
            value={form.tags}
            className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            onChange={(e) => handleChange("tags", e.target.value)}
            disabled={loading}
          />

          {/* 🔞 NSFW */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNSFW}
              onChange={(e) => handleChange("isNSFW", e.target.checked)}
              disabled={loading}
              className="w-4 h-4"
            />
            <span>🔞 NSFW Content</span>
          </label>

          {/* 🚀 Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 text-white p-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/50 disabled:shadow-none mt-4"
          >
            {loading ? "Creating..." : "✨ Create Character"}
          </button>
        </div>

        {/* 👁 Preview */}
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl p-4 border border-zinc-700 shadow-lg">

          <img
            src={form.avatar || "https://via.placeholder.com/300x400"}
            alt="preview"
            className="w-full h-56 object-cover rounded-xl mb-3 border border-zinc-600"
          />

          <h2 className="text-lg font-bold mb-2">
            {form.name || "Character Name"}
          </h2>

          <p className="text-gray-300 text-sm mb-3">
            {form.description || "Description..."}
          </p>

          <div className="mb-3 p-3 bg-zinc-800/50 rounded border border-zinc-600">
            <p className="text-xs text-gray-400 mb-1">Personality:</p>
            <p className="text-sm text-purple-300">{form.personality || "Personality traits..."}</p>
          </div>

          <div className="mb-3 p-3 bg-zinc-800/50 rounded border border-zinc-600">
            <p className="text-xs text-gray-400 mb-1">Scenario:</p>
            <p className="text-sm text-purple-300">{form.scenario || "Scenario..."}</p>
          </div>

          <p className="text-xs text-blue-400 mb-2">
            #{form.tags || "tags"}
          </p>

          {form.isNSFW && (
            <span className="inline-block text-red-400 text-xs bg-red-900/30 px-2 py-1 rounded border border-red-500">🔞 NSFW</span>
          )}
        </div>

      </div>
    </div>
  )
}