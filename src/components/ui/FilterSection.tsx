import React from 'react';

interface FilterSectionProps {
  title: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function FilterSection({ title, items, selected = [], onChange }: FilterSectionProps) {
  const toggleItem = (item: string) => {
    const newSelected = selected.includes(item)
      ? selected.filter(i => i !== item)
      : [...selected, item];
    onChange(newSelected);
  };

  return (
    <div>
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggleItem(item)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                       focus:ring-blue-500 dark:focus:ring-blue-400 h-4 w-4"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}