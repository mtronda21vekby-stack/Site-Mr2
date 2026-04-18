import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05070B",
        surface: "#0B1020",
        "surface-2": "#11192E",
        text: "#F5F7FB",
        muted: "#95A0B8",
        line: "rgba(255,255,255,0.08)",
        "accent-blue": "#4DA2FF",
        "accent-cyan": "#2DE2E6",
        "accent-gold": "#D6A85F",
        "danger-soft": "#FF7A7A"
      },
      fontFamily: {
        heading: ["Sora", "Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 48px rgba(45, 226, 230, 0.18)",
        gold: "0 0 32px rgba(214, 168, 95, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
