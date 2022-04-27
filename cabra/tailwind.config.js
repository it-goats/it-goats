/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [],
  theme: {
    colors: {
      ...colors,
      primary: "#071275",
      secondary: "#153587",
      tertiary: "#beccef",
      success: "#4fe77d",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
