import React from 'react';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  count: number | null;
}

interface RepositoryNavProps {
  items: NavItem[];
  currentPath: string[];
  onPathChange: (path: string[]) => void;
}

export function RepositoryNav({ items, currentPath, onPathChange }: RepositoryNavProps) {
  return (
    <div className="border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex -mb-px space-x-8">
          {items.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex items-center px-1 py-4 text-sm font-medium border-b-2",
                item.label === 'Code'
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
              {item.count !== null && (
                <span className={cn(
                  "ml-2 py-0.5 px-2 rounded-full text-xs",
                  item.label === 'Code'
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800"
                )}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 py-4 text-sm text-gray-600 dark:text-gray-400">
          {currentPath.map((segment, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <button
                onClick={() => onPathChange(currentPath.slice(0, index + 1))}
                className="hover:text-blue-500 hover:underline"
              >
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}