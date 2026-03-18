'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
const ThemeContext = createContext<{ theme: Theme; cycle: () => void }>({ theme: 'system', cycle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    if (theme !== 'system') html.classList.add(theme);
    if (theme === 'system') localStorage.removeItem('theme');
    else localStorage.setItem('theme', theme);
  }, [theme]);

  const cycle = () => setTheme(t => t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system');

  return <ThemeContext.Provider value={{ theme, cycle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
