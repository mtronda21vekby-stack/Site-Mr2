/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#05070B',
        surface: '#0B1020',
        'surface-2': '#11192E',
        text: '#F5F7FB',
        muted: '#95A0B8',
        line: 'rgba(255,255,255,0.08)',
        'accent-blue': '#4DA2FF',
        'accent-cyan': '#2DE2E6',
        'accent-gold': '#D6A85F',
        'danger-soft': '#FF7A7A',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
