/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0757D8',
        surface: '#0B6CFF',
        'surface-2': '#0A4FC4',
        text: '#FFFFFF',
        muted: '#DCEBFF',
        line: 'rgba(255,255,255,0.18)',
        'accent-blue': '#FFFFFF',
        'accent-cyan': '#EAF5FF',
        'accent-gold': '#FFFFFF',
        'danger-soft': '#FFB4B4',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
