import React from 'react';
import { Sparkles } from 'lucide-react';
import { SpacesList } from '../spaces/SpacesList';
import { ModelsList } from '../models/ModelsList';
import { DatasetsList } from '../datasets/DatasetsList';
import { useSpaces } from '../../hooks/useSpaces';
import { useModels } from '../../hooks/useModels';
import { useDatasets } from '../../hooks/useDatasets';

export function TrendingSection() {
  const { spaces, loading: loadingSpaces } = useSpaces({ limit: 3 });
  const { models, loading: loadingModels } = useModels({ limit: 3 });
  const { datasets, loading: loadingDatasets } = useDatasets({ limit: 3 });

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-yellow-400" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Trending this week
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Spaces */}
        <div className="space-y-6 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Spaces
            </h3>
            <a href="/spaces" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all →
            </a>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-900/30 rounded-xl p-6">
            <SpacesList 
              spaces={spaces}
              loading={loadingSpaces}
              error={null}
            />
          </div>
        </div>

        {/* Trending Models */}
        <div className="space-y-6 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Models
            </h3>
            <a href="/models" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all →
            </a>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800/50 dark:to-purple-900/30 rounded-xl p-6">
            <ModelsList 
              models={models}
              loading={loadingModels}
              error={null}
            />
          </div>
        </div>

        {/* Trending Datasets */}
        <div className="space-y-6 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Datasets
            </h3>
            <a href="/datasets" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all →
            </a>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800/50 dark:to-green-900/30 rounded-xl p-6">
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