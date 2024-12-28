import React from 'react';
import { Layout } from '../components/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ModelsContent } from '../components/models/ModelsContent';

export function ModelsPage() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <ModelsContent />
        </div>
      </ErrorBoundary>
    </Layout>
  );
}