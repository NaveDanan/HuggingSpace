import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ] as const;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Theme Preferences</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className={`p-4 rounded-lg border-2 text-left transition-colors
                      ${theme === id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 dark:text-gray-400" />
              <span className="font-medium dark:text-white">{name}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {id === 'system' 
                ? 'Match your system theme'
                : `Use ${name.toLowerCase()} theme`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}