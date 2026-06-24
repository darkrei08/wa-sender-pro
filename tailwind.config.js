/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.vue',
    './components/**/*.vue',
    './layouts/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // ── Design System "Pro Connect" (from Google Stitch) ────────────────
        // Surface hierarchy (dark mode native)
        surface: {
          DEFAULT: "#051424",
          dim: "#051424",
          bright: "#2c3a4c",
          variant: "#273647",
        },
        "surface-container": {
          lowest: "#010f1f",
          low: "#0d1c2d",
          DEFAULT: "#122131",
          high: "#1c2b3c",
          highest: "#273647",
        },
        "on-surface": {
          DEFAULT: "#d4e4fa",
          variant: "#bbcbb9",
        },
        // Primary (WhatsApp Green)
        primary: {
          DEFAULT: "#4ff07f",
          container: "#25d366",
          fixed: "#66ff8e",
          "fixed-dim": "#3de273",
        },
        "on-primary": {
          DEFAULT: "#003915",
          container: "#005523",
        },
        // Secondary (Blue accents)
        secondary: {
          DEFAULT: "#adc6ff",
          container: "#0566d9",
          fixed: "#d8e2ff",
          "fixed-dim": "#adc6ff",
        },
        // Tertiary (Emerald accents)
        tertiary: {
          DEFAULT: "#5eecaf",
          container: "#3acf95",
        },
        // Functional
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
        outline: {
          DEFAULT: "#869584",
          variant: "#3c4a3d",
        },
        // Legacy WhatsApp shortcuts
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#128C7E",
          light: "#DCF8C6",
          bg: "#ECE5DD",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.25rem",
        xl: "1.5rem",
      },
      spacing: {
        "sidebar": "280px",
      },
      backdropBlur: {
        xs: "2px",
        glass: "20px",
        "glass-heavy": "40px",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "slide-in": {
          from: { transform: "translateY(-10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(37,211,102,0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(37,211,102,0.6)" },
        },
        scan: {
          "0%, 100%": { top: "0" },
          "50%": { top: "100%" },
        },
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "scan": "scan 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
