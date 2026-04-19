import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
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
        'danger-soft': '#FF7A7A'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(77,162,255,0.18)',
        card: '0 20px 60px rgba(0,0,0,0.22)'
      },
      fontFamily: {
        sora: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'planet-core': 'radial-gradient(circle at 35% 30%, rgba(45,226,230,0.22), transparent 28%), radial-gradient(circle at 65% 65%, rgba(214,168,95,0.18), transparent 25%), linear-gradient(145deg, #17223F 0%, #0B1020 45%, #09101C 100%)'
      }
    }
  },
  plugins: []
};

export default config;
