import React from 'react';
import { FilterSection } from '../ui/FilterSection';
import type { SpaceFilters as Filters } from '../../types/spaces';

interface SpaceFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function SpaceFilters({ filters, onChange }: SpaceFiltersProps) {
  const categories = [
    'Machine Learning',
    'Data Visualization',
    'Web Development',
    'API',
    'Demo',
  ];

  const frameworks = [
    'Gradio',
    'Streamlit',
    'Custom',
  ];

  return (
    <div className="space-y-6">
      <FilterSection
        title="Category"
        items={categories}
        selected={filters.categories}
        onChange={(categories) => onChange({ ...filters, categories })}
      />

      <FilterSection
        title="Framework"
        items={frameworks}
        selected={filters.frameworks}
        onChange={(frameworks) => onChange({ ...filters, frameworks })}
      />
    </div>
  );
}