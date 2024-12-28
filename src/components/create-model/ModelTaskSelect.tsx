import React from 'react';
import { FormField } from '../ui/FormField';

interface ModelTaskSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const TASKS = [
  { id: 'text-generation', name: 'Text Generation' },
  { id: 'image-classification', name: 'Image Classification' },
  { id: 'object-detection', name: 'Object Detection' },
  { id: 'translation', name: 'Translation' },
  { id: 'summarization', name: 'Summarization' },
];

export function ModelTaskSelect({ value, onChange, error }: ModelTaskSelectProps) {
  return (
    <FormField
      label="Task"
      error={error}
      tooltip="Select the primary task of your model"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                 focus:border-transparent"
      >
        {TASKS.map((task) => (
          <option key={task.id} value={task.id}>
            {task.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}