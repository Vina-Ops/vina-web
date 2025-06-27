// .storybook/preview.js
import "../src/index.css"; // Import your Tailwind CSS

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    expanded: true,
  },
  docs: {
    theme: {
      base: "light",
      brandTitle: "Input Components",
      brandUrl: "/",
    },
  },
  backgrounds: {
    default: "light",
    values: [
      {
        name: "light",
        value: "#f8fafc",
      },
      {
        name: "dark",
        value: "#1e293b",
      },
      {
        name: "white",
        value: "#ffffff",
      },
    ],
  },
  viewport: {
    viewports: {
      mobile: {
        name: "Mobile",
        styles: {
          width: "375px",
          height: "667px",
        },
      },
      tablet: {
        name: "Tablet",
        styles: {
          width: "768px",
          height: "1024px",
        },
      },
      desktop: {
        name: "Desktop",
        styles: {
          width: "1024px",
          height: "768px",
        },
      },
    },
  },
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: ["light", "dark"],
      showName: true,
    },
  },
};
