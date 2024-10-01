const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {}, // Make sure to include the extend key to avoid overriding
    daisyui: {
      themes: ["light", "dark", "cupcake"],
    },
    colors: {
      primary: "#233d4d",
      secondary: "#ecc94b",

      transparent: "transparent",
      current: "currentColor",
      sand: "#f2e3bc",
      red: colors.red, 
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
  },
  plugins: [require("daisyui")],
};
