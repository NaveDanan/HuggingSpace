import React from 'react';
import { Star } from 'lucide-react';
import { SpacesList } from '../spaces/SpacesList';
import { ModelsList } from '../models/ModelsList';
import { DatasetsList } from '../datasets/DatasetsList';
import { useSpaces } from '../../hooks/useSpaces';
import { useModels } from '../../hooks/useModels';
import { useDatasets } from '../../hooks/useDatasets';

export function FeaturedSection() {
  const { spaces, loading: loadingSpaces } = useSpaces({ featured: true, limit: 3 });
  const { models, loading: loadingModels } = useModels({ featured: true, limit: 3 });
  const { datasets, loading: loadingDatasets } = useDatasets({ featured: true, limit: 3 });

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-yellow-400" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Featured
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Spaces */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Spaces
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
            <SpacesList 
              spaces={spaces}
              loading={loadingSpaces}
              error={null}
            />
          </div>
        </div>

        {/* Featured Models */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Models
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
            <ModelsList 
              models={models}
              loading={loadingModels}
              error={null}
            />
          </div>
        </div>

        {/* Featured Datasets */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Datasets
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
            <DatasetsList 
              datasets={datasets}
              loading={loadingDatasets}
              error={null}
            />
          </div>
        </div>
      </div>
    </section>
  );
}