const config = {
  darkMode: "class",
  content: [
    "./page/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        "background-white": "#FAFFFA",
        "light-green": "#F3FFF1",
        "leaf-green": "#307C31",
        "olive-green": "#83CD20",
        greener: "#27391c",
        "dark-green": "#034834",
        white: "#FFFFFF",
        black: "#272727",
        secondary: "#6B788E",

        // Dark mode specific colors
        "dark-bg": {
          50: "#0a0a0a",
          100: "#1a1a1a",
          200: "#2a2a2a",
          300: "#3a3a3a",
          400: "#4a4a4a",
          500: "#5a5a5a",
          600: "#6a6a6a",
          700: "#7a7a7a",
          800: "#8a8a8a",
          900: "#9a9a9a",
        },
        "dark-surface": {
          50: "#0f0f0f",
          100: "#1f1f1f",
          200: "#2f2f2f",
          300: "#3f3f3f",
          400: "#4f4f4f",
          500: "#5f5f5f",
          600: "#6f6f6f",
          700: "#7f7f7f",
          800: "#8f8f8f",
          900: "#9f9f9f",
        },
        "dark-accent": {
          50: "#0d1a0d",
          100: "#1a2a1a",
          200: "#273a27",
          300: "#344a34",
          400: "#415a41",
          500: "#4e6a4e",
          600: "#5b7a5b",
          700: "#688a68",
          800: "#759a75",
          900: "#82aa82",
        },
        // Enhanced green palette for dark mode
        green: {
          50: "#f0f9f0",
          100: "#e1f3e1",
          200: "#c3e7c3",
          300: "#a5dba5",
          400: "#87cf87",
          500: "#69c369",
          600: "#4bb74b",
          700: "#2dab2d",
          800: "#0f9f0f",
          900: "#013F25", // Your original green
        },
        // Neutral grays for better contrast
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      animation: {
        "theme-transition": "theme-transition 0.3s ease-in-out",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "bounce-slow": "bounce 3s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-delay": "fadeIn 0.5s ease-out 0.2s both",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        "theme-transition": {
          "0%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(131, 205, 32, 0.5)" },
          "100%": {
            boxShadow:
              "0 0 20px rgba(131, 205, 32, 0.8), 0 0 30px rgba(131, 205, 32, 0.6)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionProperty: {
        theme:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
      },
    },
  },
  plugins: [],
};

export default config;
