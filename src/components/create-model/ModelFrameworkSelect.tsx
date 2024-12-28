import React from 'react';
import { FormField } from '../ui/FormField';

interface ModelFrameworkSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const FRAMEWORKS = [
  { id: 'pytorch', name: 'PyTorch' },
  { id: 'tensorflow', name: 'TensorFlow' },
  { id: 'jax', name: 'JAX' },
  { id: 'scikit-learn', name: 'scikit-learn' },
];

export function ModelFrameworkSelect({ value, onChange, error }: ModelFrameworkSelectProps) {
  return (
    <FormField
      label="Framework"
      error={error}
      tooltip="Select the framework used to build your model"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                 focus:border-transparent"
      >
        {FRAMEWORKS.map((framework) => (
          <option key={framework.id} value={framework.id}>
            {framework.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}