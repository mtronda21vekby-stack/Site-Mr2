/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        surface: '#F7FAFF',
        'surface-2': '#EEF4FF',
        text: '#0B1F4D',
        muted: '#42526E',
        line: 'rgba(11,31,77,0.14)',
        'accent-blue': '#0B1F4D',
        'accent-cyan': '#123A73',
        'accent-gold': '#0B1F4D',
        'danger-soft': '#B42318',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
