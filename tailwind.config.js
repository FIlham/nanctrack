/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        base: {
          900: "#0D0F14",
          800: "#161920",
          700: "#1E2128",
          600: "#282C36",
        },
        primary: {
          DEFAULT: "#6C63FF",
          light: "#8B85FF",
        },
        secondary: "#00C9A7",
        tertiary: "#FF6B6B",
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.3)",
        modal: "0 8px 48px rgba(0,0,0,0.5)",
        "glow-p": "0 0 20px rgba(108,99,255,0.25)",
        "glow-s": "0 0 20px rgba(0,201,167,0.2)",
      },
    },
  },
  plugins: [],
};
