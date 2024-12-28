import React from 'react';
import { Layout } from '../components/Layout';
import { Database } from 'lucide-react';
import { CreateModelForm } from '../components/create-model/CreateModelForm';

export function CreateModelPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Database className="w-10 h-10 text-blue-500 dark:text-blue-400" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Create a new Model</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Share your machine learning models with the community. Support for PyTorch,
              TensorFlow, and other popular frameworks.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <CreateModelForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}