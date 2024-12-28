import React from 'react';
import { Key, Trash2 } from 'lucide-react';

export function AccessTokenSettings() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Access Tokens</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   dark:focus:ring-offset-gray-800"
        >
          Create Token
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
        <Key className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No access tokens yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Create an access token to interact with our API programmatically.
        </p>
      </div>

      {/* Example token - hidden by default */}
      <div className="hidden border dark:border-gray-700 rounded-lg mt-6">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">API Token</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created on March 20, 2024</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}