import React from 'react';
import { FormField } from '../ui/FormField';

interface LicenseSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const LICENSE_OPTIONS = [
  { id: 'apache-2.0', name: 'Apache License 2.0', description: 'Permissive license that allows commercial use' },
  { id: 'mit', name: 'MIT License', description: 'Simple and permissive' },
  { id: 'gpl-3.0', name: 'GNU GPL v3', description: 'Copyleft license that requires sharing modifications' },
];

export function LicenseSelect({ value, onChange, error }: LicenseSelectProps) {
  return (
    <FormField
      label="License"
      error={error}
      tooltip="Choose how others can use your Space"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                 focus:border-transparent"
      >
        {LICENSE_OPTIONS.map((license) => (
          <option key={license.id} value={license.id}>
            {license.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}