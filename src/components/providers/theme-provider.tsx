import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

/**
 * Kodeka theme model:
 * - Default (no class on <html>) = DARK theme (Kodeka brand)
 * - `.light` class on <html>     = LIGHT theme (opt-in)
 * - `.dark`  class on <html>     = DARK  theme (explicit, mirrors default)
 *
 * `useUIStore.theme` values: "dark" | "light" | "system"
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    const applyMode = (mode: "dark" | "light") => {
      if (mode === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    };

    if (theme === "dark") {
      applyMode("dark");
    } else if (theme === "light") {
      applyMode("light");
    } else {
      // System preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyMode(mediaQuery.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) =>
        applyMode(e.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  return <>{children}</>;
}
