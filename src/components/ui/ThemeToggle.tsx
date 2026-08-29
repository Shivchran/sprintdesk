import { useThemeStore } from "../../stores/themeStore";

function ThemeToggle() {
  const theme = useThemeStore(
    (state) => state.theme
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme
  );

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      title={
        isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;