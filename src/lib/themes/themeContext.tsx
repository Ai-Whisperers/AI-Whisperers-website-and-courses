'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLOR_THEMES, ColorTheme } from './colorThemes';

interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (themeId: string) => void;
  availableThemes: typeof COLOR_THEMES;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>('blueProfessional');

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && COLOR_THEMES[savedTheme as keyof typeof COLOR_THEMES]) {
      setCurrentThemeId(savedTheme);
    }
  }, []);

  const setTheme = (themeId: string) => {
    if (COLOR_THEMES[themeId as keyof typeof COLOR_THEMES]) {
      setCurrentThemeId(themeId);
      localStorage.setItem('selectedTheme', themeId);
      
      // Apply theme CSS variables to document root
      const theme = COLOR_THEMES[themeId as keyof typeof COLOR_THEMES];
      const root = document.documentElement;
      
      // Apply primary colors
      Object.entries(theme.primary).forEach(([key, value]) => {
        root.style.setProperty(`--color-primary-${key}`, value);
      });
      
      // Apply secondary colors
      Object.entries(theme.secondary).forEach(([key, value]) => {
        root.style.setProperty(`--color-secondary-${key}`, value);
      });
      
      // Apply accent colors
      Object.entries(theme.accent).forEach(([key, value]) => {
        root.style.setProperty(`--color-accent-${key}`, value);
      });
      
      // Apply neutral colors
      Object.entries(theme.neutral).forEach(([key, value]) => {
        root.style.setProperty(`--color-neutral-${key}`, value);
      });
      
      // Apply status colors
      Object.entries(theme.success).forEach(([key, value]) => {
        root.style.setProperty(`--color-success-${key}`, value);
      });
      
      Object.entries(theme.warning).forEach(([key, value]) => {
        root.style.setProperty(`--color-warning-${key}`, value);
      });
      
      Object.entries(theme.error).forEach(([key, value]) => {
        root.style.setProperty(`--color-error-${key}`, value);
      });
    }
  };

  // Apply initial theme
  useEffect(() => {
    setTheme(currentThemeId);
  }, [currentThemeId]);

  const value: ThemeContextType = {
    currentTheme: COLOR_THEMES[currentThemeId as keyof typeof COLOR_THEMES],
    setTheme,
    availableThemes: COLOR_THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}