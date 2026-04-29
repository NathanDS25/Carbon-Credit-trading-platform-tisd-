/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0F12",
        surface: "#13151A",
        primary: {
          DEFAULT: "#00C896",
          glow: "rgba(0, 200, 150, 0.4)",
        },
        danger: {
          DEFAULT: "#FF4F5E",
          glow: "rgba(255, 79, 94, 0.4)",
        },
        info: {
          DEFAULT: "#3B82F6",
          glow: "rgba(59, 130, 246, 0.4)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9BA3AF",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(0, 200, 150, 0.2)',
        'glow-red': '0 0 15px rgba(255, 79, 94, 0.2)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.2)',
      }
    },
  },
  plugins: [],
}
