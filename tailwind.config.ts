import type { Config } from 'tailwindcss';

import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
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
        'danger-soft': '#FF7A7A'
      },
      fontFamily: {
        // Use CSS variables provided by next/font for Sora and Inter.
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        sora: ['var(--font-sora)', ...defaultTheme.fontFamily.sans],
        inter: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      }
    }
  },
  plugins: []
};

export default config;