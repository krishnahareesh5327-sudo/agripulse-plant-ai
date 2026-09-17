/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f9f3',
          100: '#e1f2e5',
          200: '#c3e5cb',
          300: '#94d1a3',
          400: '#5fb575',
          500: '#3a9a52',
          600: '#2c7c3f',
          700: '#256334',
          800: '#204f2c',
          900: '#1c4126',
          950: '#0b2413',
        },
        earth: {
          50: '#faf7f2',
          100: '#f3ece1',
          200: '#e5d7c3',
          300: '#d4bc9e',
          400: '#c19e79',
          500: '#b1845f',
          600: '#9e6d51',
          700: '#835444',
          800: '#6c453c',
          900: '#5c3d36',
          950: '#341f1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
