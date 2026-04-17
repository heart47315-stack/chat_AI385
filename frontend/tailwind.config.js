/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(168, 85, 247, 0), 0 20px 40px rgba(0, 0, 0, 0.4)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(168, 85, 247, 0.3), 0 20px 60px rgba(168, 85, 247, 0.1)",
          },
        },
      },
    },
  },
  plugins: [],
}
