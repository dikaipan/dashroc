/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palet gelap premium
        slate: {
          900: "#0b1220",
          800: "#121a2a",
          700: "#182238",
          600: "#1e2a45",
        },
        primary: {
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        accent: {
          500: "#22d3ee",
          600: "#06b6d4",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};