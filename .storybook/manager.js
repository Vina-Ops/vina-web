// .storybook/manager.js
import { addons } from "@storybook/addons";
import { themes } from "@storybook/theming";

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: "Input Components Design System",
    brandUrl: "/",
    fontBase: '"Inter", sans-serif',
  },
});
