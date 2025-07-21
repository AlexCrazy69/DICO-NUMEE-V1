import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const [theme, setThemeState] = useState<Theme>('system');

  const applyTheme = useCallback((selectedTheme: Theme) => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');

    if (selectedTheme === 'classic') {
      document.documentElement.setAttribute('data-theme', 'classic');
    } else {
      const isDark =
        selectedTheme === 'dark' ||
        (selectedTheme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
          document.documentElement.classList.add('dark');
      }
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = storedTheme || 'system';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme]);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme === 'system' || !storedTheme) {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return [theme, setTheme];
};