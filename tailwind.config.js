/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f2f8fc',
          100: '#e1eff8',
          200: '#cae0f2',
          300: '#a3cbe8',
          400: '#75abda',
          500: '#528dcd',
          600: '#4274c0',
          700: '#3861ab',
          800: '#31518d',
          900: '#2c4570',
          950: '#1d2c46',
        },
        coral: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfca',
          300: '#fcafe9',
          400: '#f88277',
          500: '#f25b4d',
          600: '#de3d2f',
          700: '#ba3024',
          800: '#992b21',
          900: '#7e2920',
          950: '#44120e',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
