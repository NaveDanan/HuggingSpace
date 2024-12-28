import React from 'react';
import { DatasetFilters } from './DatasetFilters';
import { DatasetsList } from './DatasetsList';
import { DatasetSearch } from './DatasetSearch';
import { DatasetSort } from './DatasetSort';
import { useDatasets } from '../../hooks/useDatasets';

export function DatasetsContent() {
  const { 
    datasets, 
    filters, 
    setFilters, 
    loading, 
    error 
  } = useDatasets();

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Datasets</h1>
        
        <DatasetSearch 
          onSearch={(search) => handleFilterChange({ search })} 
        />

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <DatasetFilters 
              filters={filters} 
              onChange={handleFilterChange} 
            />
          </aside>

          <main className="flex-1">
            <div className="flex justify-end mb-4">
              <DatasetSort 
                value={filters.sort} 
                onChange={(sort) => handleFilterChange({ sort })} 
              />
            </div>
            <DatasetsList 
              datasets={datasets} 
              loading={loading} 
              error={error} 
            />
          </main>
        </div>
      </div>
    </div>
  );
}