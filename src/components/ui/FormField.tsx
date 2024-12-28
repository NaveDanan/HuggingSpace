import React from 'react';
import { Info } from 'lucide-react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  tooltip?: string;
}

export function FormField({ label, children, error, tooltip }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2
                          bg-gray-900 dark:bg-gray-700 text-sm text-white rounded-lg opacity-0
                          group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      {children}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}