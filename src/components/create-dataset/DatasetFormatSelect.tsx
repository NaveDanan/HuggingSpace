import React from 'react';
import { FormField } from '../ui/FormField';

interface DatasetFormatSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const FORMATS = [
  { id: 'csv', name: 'CSV' },
  { id: 'json', name: 'JSON' },
  { id: 'parquet', name: 'Parquet' },
  { id: 'arrow', name: 'Arrow' },
  { id: 'custom', name: 'Custom Format' },
];

export function DatasetFormatSelect({ value, onChange, error }: DatasetFormatSelectProps) {
  return (
    <FormField
      label="Format"
      error={error}
      tooltip="Select the file format of your dataset"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2
                 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {FORMATS.map((format) => (
          <option key={format.id} value={format.id}>
            {format.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}