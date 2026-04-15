import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:5000"

export default function CreateCharacter() {
  const navigate = useNavigate()

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
  }

  const submit = async () => {
    if (!form.name) return alert("ใส่ชื่อก่อน!")

    try {
      await axios.post(`${API}/character`, form)
      alert("สร้างตัวละครสำเร็จ!")
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("error")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Create Character</h1>

        <button
          onClick={() => navigate("/")}
          className="text-gray-400"
        >
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 🧾 FORM */}
        <div className="flex flex-col gap-3">

          <input
            placeholder="Name"
            className="p-2 bg-zinc-900 rounded"
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <input
            placeholder="Avatar URL"
            className="p-2 bg-zinc-900 rounded"
            onChange={(e) => handleChange("avatar", e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="p-2 bg-zinc-900 rounded"
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <textarea
            placeholder="Personality"
            className="p-2 bg-zinc-900 rounded"
            onChange={(e) => handleChange("personality", e.target.value)}
          />

          <textarea
            placeholder="Scenario"
            className="p-2 bg-zinc-900 rounded"
            onChange={(e) => handleChange("scenario", e.target.value)}
          />

          <input
            placeholder="Tags (romance, horror...)"
            className="p-2 bg-zinc-900 rounded"
            onChange={(e) => handleChange("tags", e.target.value)}
          />

          {/* 🔞 NSFW */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => handleChange("isNSFW", e.target.checked)}
            />
            NSFW
          </label>

          {/* 🚀 Submit */}
          <button
            onClick={submit}
            className="bg-blue-500 p-2 rounded mt-2"
          >
            Create
          </button>
        </div>

        {/* 👁 Preview */}
        <div className="bg-zinc-900 rounded-2xl p-4">

          <img
            src={form.avatar || "https://via.placeholder.com/300"}
            className="w-full h-48 object-cover rounded-xl mb-3"
          />

          <h2 className="text-lg font-bold">
            {form.name || "Character Name"}
          </h2>

          <p className="text-gray-400 text-sm">
            {form.description || "Description..."}
          </p>

          <p className="text-xs text-blue-400 mt-2">
            #{form.tags || "tags"}
          </p>

          {form.isNSFW && (
            <span className="text-red-400 text-xs">🔞 NSFW</span>
          )}
        </div>

      </div>
    </div>
  )
}