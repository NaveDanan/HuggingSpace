import React from 'react';
import { Layout } from '../components/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SpacesContent } from '../components/spaces/SpacesContent';

export function SpacesPage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <SpacesContent />
        </div>
      </ErrorBoundary>
    </Layout>
  );
}