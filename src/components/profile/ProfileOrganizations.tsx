import React from 'react';
import { Building2 } from 'lucide-react';

export function ProfileOrganizations() {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
        <Building2 className="w-4 h-4" />
        <h2 className="font-medium">Organizations</h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">None yet</p>
    </div>
  );
}