import { useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const theme = useThemeStore(
    (state) => state.theme
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  return <>{children}</>;
}

export default ThemeProvider;