const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#ecc94b",
        customBlue: "#3b82f6", // Custom blue
        customOrange: "#f97316", // Custom orange

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
    }, // Make sure to include the extend key to avoid overriding
    daisyui: {
      themes: ["light", "dark", "cupcake"],
    },
    
  },
  plugins: [require("daisyui")],
};
