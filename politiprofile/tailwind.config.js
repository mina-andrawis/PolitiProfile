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
        primary: "#1d232a",
        secondary: "#6366f1",
        secondaryHover: "#4f46e5",
        customOrange: "#f97316", // Custom orange
        defaultTextColor: "#A0AEC0",
        transparent: "transparent",
      },
      daisyui: {
        themes: ["light", "dark", "cupcake"],
      },
    }, // Make sure to include the extend key to avoid overriding
  },
  plugins: [require("daisyui")],
};
