import { useState, useEffect } from "react";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 sun-icon"
  >
    <defs>
      <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FBBF24", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#F59E0B", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#sun-gradient)"
      d="M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10zm0-12a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm0 14a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-8-6a1 1 0 1 0-2 0a1 1 0 0 0 2 0zm14 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0zM6.343 6.343a1 1 0 1 0-1.414-1.414a1 1 0 0 0 1.414 1.414zm11.314 11.314a1 1 0 1 0-1.414-1.414a1 1 0 0 0 1.414 1.414zm-11.314 0a1 1 0 1 0 1.414-1.414a1 1 0 0 0-1.414 1.414zm11.314-11.314a1 1 0 1 0 1.414-1.414a1 1 0 0 0-1.414 1.414z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 moon-icon"
  >
    <defs>
      <linearGradient id="moon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#E0E7FF", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#moon-gradient)"
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
    />
  </svg>
);

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTheme(currentTheme);
  }, []);

  useEffect(() => {
    if (theme === null) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  if (theme === null) {
    return <div className="h-10 w-10" />;
  }
  return (
    <button
      onClick={handleClick}
      className="relative h-10 w-10 rounded-full bg-neutral-100 p-2 text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
      aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
    >
      <div className="relative h-full w-full">
        <SunIcon />
        <MoonIcon />
      </div>
    </button>
  );
}
