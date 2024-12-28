import React from 'react';
import { Clock } from 'lucide-react';
import { SpacesList } from '../spaces/SpacesList';
import { ModelsList } from '../models/ModelsList';
import { DatasetsList } from '../datasets/DatasetsList';
import { useSpaces } from '../../hooks/useSpaces';
import { useModels } from '../../hooks/useModels';
import { useDatasets } from '../../hooks/useDatasets';

export function RecentSection() {
  const { spaces, loading: loadingSpaces } = useSpaces({ limit: 3 });
  const { models, loading: loadingModels } = useModels({ limit: 3 });
  const { datasets, loading: loadingDatasets } = useDatasets({ limit: 3 });

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-8 h-8 text-blue-500" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recently Added
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Spaces */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Spaces
            </h3>
            <a href="/spaces" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Browse all →
            </a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-gray-700">
            <SpacesList 
              spaces={spaces}
              loading={loadingSpaces}
              error={null}
            />
          </div>
        </div>

        {/* Recent Models */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Models
            </h3>
            <a href="/models" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Browse all →
            </a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-gray-700">
            <ModelsList 
              models={models}
              loading={loadingModels}
              error={null}
            />
          </div>
        </div>

        {/* Recent Datasets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Datasets
            </h3>
            <a href="/datasets" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Browse all →
            </a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-gray-700">
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