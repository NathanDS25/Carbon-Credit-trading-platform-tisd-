/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#060913',
          surface: 'rgba(15, 23, 42, 0.65)', // Slate 900 translucent
          border: 'rgba(51, 65, 85, 0.5)' // Slate 700 translucent
        },
        accent: {
          cyan: '#22d3ee',
          blue: '#3b82f6',
          teal: '#14b8a6',
          red: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4)',
      }
    },
  },
  plugins: [],
}
