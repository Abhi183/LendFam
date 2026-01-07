/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(34,197,94,0.25), 0 0 40px rgba(34,197,94,0.18)"
      }
    },
  },
  plugins: [],
}
