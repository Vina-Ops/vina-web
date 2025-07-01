/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./page/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-white": "#FAFFFA",
        "light-green": "#F3FFF1",
        "leaf-green": "#307C31",
        "olive-green": "#83CD20",
        green: "#27391C",
        "dark-green": "#034834",
        white: "#FFFFFF",
        black: "#272727",
        secondary: "#6B788E",
      },
    },
  },
  plugins: [],
}

