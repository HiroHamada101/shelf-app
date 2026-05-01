import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { THEMES } from "../constants/themes";

const STORAGE_KEY = "shelf.theme";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    let mounted = true;

    async function loadMode() {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted && (value === "light" || value === "dark")) {
          setMode(value);
        }
      } catch {
        /* ignore */
      }
    }

    loadMode();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleMode = useCallback(async () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      theme: THEMES[mode],
      toggleMode,
    }),
    [mode, toggleMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
