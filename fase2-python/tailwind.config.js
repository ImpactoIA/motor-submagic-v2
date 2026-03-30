/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        viral: {
          bg: '#0B0E14',      // Tu fondo negro
          card: '#151A25',    // Tus tarjetas
          border: '#2D3748',
          primary: '#8B5CF6', // Tu violeta neón
          secondary: '#A78BFA',
          text: '#F1F5F9',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}