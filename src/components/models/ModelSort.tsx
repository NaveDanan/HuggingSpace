import React from 'react';
import type { SortOption } from '../../types/models';

interface ModelSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function ModelSort({ value, onChange }: ModelSortProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                text-gray-900 dark:text-white rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-transparent"
    >
      <option value="downloads">Most Downloads</option>
      <option value="updated">Recently Updated</option>
      <option value="trending">Trending</option>
      <option value="name">Name</option>
    </select>
  );
}