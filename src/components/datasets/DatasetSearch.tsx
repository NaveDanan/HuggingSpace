import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface DatasetSearchProps {
  onSearch: (query: string) => void;
}

export function DatasetSearch({ onSearch }: DatasetSearchProps) {
  const [value, setValue] = useState('');
  useDebounce(() => onSearch(value), 300, [value]);

  return (
    <div className="relative max-w-2xl w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search datasets by name, type, or format..."
        className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-700 
                 border border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
  );
}