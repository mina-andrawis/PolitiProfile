import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light"); // Local state for the theme

  // Set the initial theme based on localStorage or default to 'light'
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="form-control flex flex-col items-center">
      <label className="text-white text-sm mb-0">Theme</label>
      <label className="label p-0 cursor-pointer">
        <input
          type="checkbox"
          className="toggle toggle-sm  border-white bg-secondary [--tglbg:white] hover:bg-secondaryHover"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
      </label>
    </div>
  );
}
