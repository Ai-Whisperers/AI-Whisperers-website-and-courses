'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/themes/themeContext';
import { ChevronDown, Palette } from 'lucide-react';

export function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Select color theme"
      >
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTheme.name}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
            <div className="p-2">
              {Object.entries(availableThemes).map(([themeId, theme]) => (
                <button
                  key={themeId}
                  onClick={() => {
                    setTheme(themeId);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    currentTheme.id === themeId
                      ? 'bg-gray-50 dark:bg-gray-700'
                      : ''
                  }`}
                >
                  {/* Color Preview */}
                  <div className="flex gap-1 mt-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.primary[500] }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.secondary[500] }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.accent[500] }}
                    />
                  </div>
                  
                  {/* Theme Info */}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {theme.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {theme.description}
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {currentTheme.id === themeId && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Floating Theme Selector for development/testing
export function FloatingThemeSelector() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all ${
        isMinimized ? 'opacity-30 hover:opacity-100' : ''
      }`}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open theme selector"
        >
          <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme Tester
            </span>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Minimize theme selector"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
          </div>
          <div className="p-3">
            <ThemeSelector />
          </div>
        </div>
      )}
    </div>
  );
}