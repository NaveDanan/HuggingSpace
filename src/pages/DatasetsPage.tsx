import React from 'react';
import { Layout } from '../components/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { DatasetsContent } from '../components/datasets/DatasetsContent';

export function DatasetsPage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <DatasetsContent />
        </div>
      </ErrorBoundary>
    </Layout>
  );
}