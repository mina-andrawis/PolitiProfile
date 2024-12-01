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
          primaryText: "#3B3B3B",
          accent: "#f97316", // Orange for light mode
          neutral: "#f5f5f5", // Light background
          "base-100": "#ffffff", // White for main background
          "border-color": "#000000", 
          "secondary-text": "#4b5563",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#ef4444",
        },
        dark: {
          primary: "#4f46e5", // Purple-blue for dark mode
          secondary: "#2b2d42", // Darker blue for dark mode
          primaryText: "#A0AEC0",
          accent: "#ff7849", // Brighter orange for dark mode
          neutral: "#1a1a1a", // Dark background
          "base-100": "#1d232a", // Almost black for main background
          "secondary-text": "#4b5563",
          info: "#60a5fa",
          success: "#4ade80",
          warning: "#facc15",
          error: "#f87171",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
