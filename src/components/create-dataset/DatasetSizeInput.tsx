import React from 'react';
import { FormField } from '../ui/FormField';

interface DatasetSizeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DatasetSizeInput({ value, onChange, error }: DatasetSizeInputProps) {
  return (
    <FormField
      label="Dataset Size"
      error={error}
      tooltip="Enter the size of your dataset (e.g., '1000 samples', '2.5GB')"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., 1000 samples, 2.5GB"
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2
                 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </FormField>
  );
}