/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [],
  theme: {
    colors: {
      ...colors,
      primary: "#071275",
      secondary: "#153587",
      tertiary: "#beccef",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
