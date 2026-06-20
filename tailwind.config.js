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
        bgDark: '#09090b',
        bgLight: '#F3F4F6',
        surfaceDark: '#141416',
        surfaceLight: '#FFFFFF',
        primaryColor: '#C5A059',
        accentColor: '#D4AF37',
        cyanColor: '#D4AF37',
        textPrimaryDark: '#FFFFFF',
        textPrimaryLight: '#111827',
        textSecondaryDark: '#A1A1AA',
        textSecondaryLight: '#4B5563',
        glassBorderDark: 'rgba(255,255,255,0.05)',
        glassBorderLight: 'rgba(0,0,0,0.08)',
        glassHoverDark: 'rgba(255,255,255,0.04)',
        glassHoverLight: 'rgba(0,0,0,0.02)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
      }
    },
  },
  plugins: [],
}


