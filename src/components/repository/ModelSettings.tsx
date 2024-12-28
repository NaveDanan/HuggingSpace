import React from 'react';
import { Lock, Trash2, AlertTriangle } from 'lucide-react';
import type { Model } from '../../types/models';

interface ModelSettingsProps {
  model: Model;
}

export function ModelSettings({ model }: ModelSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Visibility Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5" />
          Visibility Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Model Visibility</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Control who can see your model
              </p>
            </div>
            <select className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 
                           dark:border-gray-600 rounded-lg text-sm">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900/50 p-6">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete Model</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete this model and all its data
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                           flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}