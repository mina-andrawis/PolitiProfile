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
        primary: "#8b5cf6",
        secondary: "#6366f1",
        secondaryHover: "#4f46e5",
        customOrange: "#f97316", // Custom orange
        defaultTextColor: "#A0AEC0",
        secondaryTextColor: "#718096",
        transparent: "transparent",
      },
      daisyui: {
        themes: ["light", "dark", "cupcake"],
      },
    }, 
  },
  plugins: [require("daisyui")],
};
