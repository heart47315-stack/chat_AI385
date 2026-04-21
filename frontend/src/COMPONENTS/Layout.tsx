import { ReactNode } from "react"
import { motion } from "framer-motion"

interface Props {
  children: ReactNode
  title?: string
  subtitle?: string
}

export default function Layout({ children, title, subtitle }: Props) {
  return (
    <div className="h-full flex flex-col text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {title && (
          <header className="px-4 pt-6 pb-4 shrink-0">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/60 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto px-4 pb-28">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}