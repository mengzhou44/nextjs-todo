/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f12",
        surface: "#1a1a1f",
        border: "#2d2d35",
        text: "#f4f4f5",
        "text-muted": "#a1a1aa",
        accent: "#22d3ee",
      },
    },
  },
  plugins: [],
};
