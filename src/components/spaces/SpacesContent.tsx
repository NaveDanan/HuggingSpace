import React from 'react';
import { SpaceFilters } from './SpaceFilters';
import { SpacesList } from './SpacesList';
import { SpaceSearch } from './SpaceSearch';
import { SpaceSort } from './SpaceSort';
import { useSpaces } from '../../hooks/useSpaces';

export function SpacesContent() {
  const { 
    spaces, 
    filters, 
    setFilters, 
    loading, 
    error 
  } = useSpaces();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spaces</h1>
        
        <SpaceSearch 
          onSearch={(query) => setFilters({ ...filters, search: query })} 
        />

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <SpaceFilters 
              filters={filters} 
              onChange={setFilters} 
            />
          </aside>

          <main className="flex-1">
            <div className="flex justify-end mb-4">
              <SpaceSort 
                value={filters.sort} 
                onChange={(sort) => setFilters({ ...filters, sort })} 
              />
            </div>
            <SpacesList 
              spaces={spaces} 
              loading={loading} 
              error={error} 
            />
          </main>
        </div>
      </div>
    </div>
  );
}