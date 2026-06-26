"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration error avoid korte
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      aria-label="Toggle theme"
    >
      {/* Sun icon */}
      <span className={`text-base transition-all ${isDark ? "opacity-40" : "opacity-100"}`}>
        ☀️
      </span>

      {/* Toggle track */}
      <div className={`relative w-10 h-5 rounded-full transition-colors ${isDark ? "bg-emerald-600" : "bg-gray-300"}`}>
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>

      {/* Moon icon */}
      <span className={`text-base transition-all ${isDark ? "opacity-100" : "opacity-40"}`}>
        🌙
      </span>
    </button>
  );
}