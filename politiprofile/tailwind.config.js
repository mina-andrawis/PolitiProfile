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
        'primary-text': 'var(--primary-text)', 
        dark: "#3B3B3B", //used for items on white background, etc.
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: "#8b5cf6", // Purple for light mode
          secondary: "#6366f1", // Blue for light mode
          primaryText: "#3B3B3B", // Dark gray-shade color
          accent: "#f97316", // Orange for light mode
          neutral: "#f5f5f5", // Light background
          "base-100": "#ffffff", // White for main background
          "border-color": "#000000",  // Black border color
          "--primary-text": "#3B3B3B", //same as dark
          info: "#3b82f6", //light blue
          success: "#22c55e",  //light green
          warning: "#fbbf24", //yellow
          error: "#ef4444", //light red
        },
        dark: {
          primary: "#4f46e5", // Purple-blue for dark mode
          secondary: "#2b2d42", // Darker blue for dark mode
          primaryText: "#A0AEC0", //gray-shade color
          accent: "#ff7849", // Brighter orange for dark mode
          neutral: "#1a1a1a", // Dark background
          "base-100": "#1d232a", // Almost black for main background
          "--primary-text": "#FFFFF0", //white-shade color
          info: "#60a5fa", //light blue
          success: "#4ade80", //light green
          warning: "#facc15", //yellow
          error: "#f87171", //light red
        },
      },
    ],
    darkTheme: "dark",
    defaultTheme: "dark",
  },
  plugins: [require("daisyui")],
};
