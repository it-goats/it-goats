/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [],
  theme: { colors },
  plugins: [require("@tailwindcss/forms")],
};
