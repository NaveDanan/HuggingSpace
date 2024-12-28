import React from 'react';
import { FormField } from '../ui/FormField';

interface ModelLanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'rust', name: 'Rust' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'go', name: 'Go' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'php', name: 'PHP' },
  { id: 'swift', name: 'Swift' },
  { id: 'kotlin', name: 'Kotlin' },
];

export function ModelLanguageSelect({ value, onChange, error }: ModelLanguageSelectProps) {
  return (
    <FormField
      label="Programming Language"
      error={error}
      tooltip="Select the primary programming language of your model"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-white rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                 focus:border-transparent"
      >
        {LANGUAGES.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}