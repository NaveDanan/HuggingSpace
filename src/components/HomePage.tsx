import React from 'react';
import { SpacesList } from './spaces/SpacesList';
import { Layout } from './Layout';
import { ErrorBoundary } from './ErrorBoundary';

export function HomePage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Spaces</h2>
              <SpacesList featured limit={3} />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Spaces</h2>
              <SpacesList limit={6} />
            </section>
          </main>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}