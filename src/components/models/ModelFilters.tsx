import React from 'react';
import { FilterSection } from '../ui/FilterSection';
import type { ModelFilters as Filters } from '../../types/models';

interface ModelFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
}

export function ModelFilters({ filters, onChange }: ModelFiltersProps) {
  const tasks = [
    'Text Generation',
    'Image Classification',
    'Object Detection',
    'Translation',
    'Summarization',
  ];

  const libraries = [
    'PyTorch',
    'TensorFlow',
    'JAX',
    'scikit-learn',
  ];

  const languages = [
    'Python',
    'JavaScript',
    'Rust',
    'C++',
    'Java',
  ];

  const handleFilterChange = (key: keyof Filters, value: string[]) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <FilterSection
        title="Task"
        items={tasks}
        selected={filters.tasks}
        onChange={(value) => handleFilterChange('tasks', value)}
      />

      <FilterSection
        title="Library"
        items={libraries}
        selected={filters.libraries}
        onChange={(value) => handleFilterChange('libraries', value)}
      />

      <FilterSection
        title="Programming Language"
        items={languages}
        selected={filters.languages}
        onChange={(value) => handleFilterChange('languages', value)}
      />
    </div>
  );
}