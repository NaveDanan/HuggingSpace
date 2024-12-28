import React from 'react';
import { ModelFilters } from './ModelFilters';
import { ModelsList } from './ModelsList';
import { ModelSearch } from './ModelSearch';
import { ModelSort } from './ModelSort';
import { useModels } from '../../hooks/useModels';

export function ModelsContent() {
  const { 
    models, 
    filters, 
    setFilters, 
    loading, 
    error 
  } = useModels();

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Models</h1>
        
        <ModelSearch 
          onSearch={(search) => handleFilterChange({ search })} 
        />

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <ModelFilters 
              filters={filters} 
              onChange={handleFilterChange} 
            />
          </aside>

          <main className="flex-1">
            <div className="flex justify-end mb-4">
              <ModelSort 
                value={filters.sort} 
                onChange={(sort) => handleFilterChange({ sort })} 
              />
            </div>
            <ModelsList 
              models={models} 
              loading={loading} 
              error={error} 
            />
          </main>
        </div>
      </div>
    </div>
  );
}