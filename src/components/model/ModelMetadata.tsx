import React from 'react';
import { Tag } from 'lucide-react';

interface ModelMetadataProps {
  framework: string;
  task: string;
  language: string;
  license: string;
  lastUpdated: string;
}

export function ModelMetadata({ 
  framework, 
  task, 
  language, 
  license,
  lastUpdated 
}: ModelMetadataProps) {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Model Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Framework</h3>
          <p className="mt-1 text-sm text-gray-900">{framework}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Task</h3>
          <p className="mt-1 text-sm text-gray-900">{task}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Language</h3>
          <p className="mt-1 text-sm text-gray-900">{language}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">License</h3>
          <p className="mt-1 text-sm text-gray-900">{license}</p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            Last updated {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}