const config = {
  content: [
    "./page/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: "var(--font-clash-display)",
        body: "var(--font-helvetica)",
        ui: "var(--font-outfit)",
        stylish: "var(--font-just_another_hand)",
        "clash-display": ["var(--font-clash-display)"],
        helvetica: ["var(--font-helvetica)"],
        outfit: ["var(--font-outfit)"],
        merriweather: ["var(--font-merriweather)"],
        "just-another-hand": ["var(--font-just_another_hand)"],
      },
      colors: {
        "background-white": "#FAFFFA",
        "light-green": "#F3FFF1",
        "leaf-green": "#307C31",
        "olive-green": "#83CD20",
        "dark-green": "#034834",
        white: "#FFFFFF",
        black: "#272727",
        secondary: "#6B788E",
        background: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          white: "var(--color-background-white)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: {
          primary: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
          dark: "var(--accent-dark)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
