import React from 'react';
import { FilterSection } from '../ui/FilterSection';
import type { DatasetFilters as Filters } from '../../types/datasets';

interface DatasetFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function DatasetFilters({ filters, onChange }: DatasetFiltersProps) {
  const types = [
    'Tabular Data',
    'Image Dataset',
    'Text Corpus',
    'Audio Dataset',
    'Video Dataset',
  ];

  const formats = [
    'CSV',
    'JSON',
    'Parquet',
    'Arrow',
    'Custom Format',
  ];

  const sizes = [
    'Small (<100MB)',
    'Medium (100MB-1GB)',
    'Large (1GB-10GB)',
    'Very Large (>10GB)',
  ];

  return (
    <div className="space-y-6">
      <FilterSection
        title="Type"
        items={types}
        selected={filters.types}
        onChange={(types) => onChange({ ...filters, types })}
      />

      <FilterSection
        title="Format"
        items={formats}
        selected={filters.formats}
        onChange={(formats) => onChange({ ...filters, formats })}
      />

      <FilterSection
        title="Size"
        items={sizes}
        selected={filters.sizes}
        onChange={(sizes) => onChange({ ...filters, sizes })}
      />
    </div>
  );
}