import React from 'react';
import { Database, Box, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SearchResult } from '../../types/search';

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
}

export function SearchResults({ results, selectedIndex, onSelect }: SearchResultsProps) {
  if (!results.length) return null;

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'model':
        return <Database className="w-4 h-4" />;
      case 'dataset':
        return <Box className="w-4 h-4" />;
      case 'space':
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                  border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
      {results.map((result, index) => (
        <button
          key={`${result.type}-${result.id}`}
          onClick={() => onSelect(result)}
          className={cn(
            "w-full px-4 py-3 flex items-start gap-3 text-left transition-colors",
            "hover:bg-gray-50 dark:hover:bg-gray-700/50",
            index === selectedIndex && "bg-gray-50 dark:bg-gray-700/50"
          )}
        >
          <div className="flex-shrink-0 mt-1 text-gray-400 dark:text-gray-500">
            {getIcon(result.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">{result.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full 
                           bg-gray-100 dark:bg-gray-700">
                {result.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
              {result.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              by {result.author}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}