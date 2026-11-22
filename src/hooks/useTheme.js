import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bilahbeu_theme';
const ThemeContext = createContext(null);

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const updateThemeMeta = (theme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B1117' : '#15803D');
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    updateThemeMeta(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);
  return createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const [fallbackTheme, setFallbackTheme] = useState(getPreferredTheme);

  useEffect(() => {
    if (!context) updateThemeMeta(fallbackTheme);
  }, [context, fallbackTheme]);

  const fallbackToggle = useCallback(() => {
    setFallbackTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return context || {
    theme: fallbackTheme,
    setTheme: setFallbackTheme,
    toggleTheme: fallbackToggle,
  };
};
