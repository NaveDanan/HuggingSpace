import React from 'react';
import { Layout } from '../components/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { TrendingSection } from '../components/home/TrendingSection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { RecentSection } from '../components/home/RecentSection';

export function HomePage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Trending Section */}
            <TrendingSection />

            {/* Featured Section */}
            <FeaturedSection />

            {/* Recent Section */}
            <RecentSection />
          </main>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}