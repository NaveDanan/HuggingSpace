import React from 'react';
import { FormField } from '../ui/FormField';
import { Monitor, Box, Cpu } from 'lucide-react';

interface SdkOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const SDK_OPTIONS: SdkOption[] = [
  {
    id: 'gradio',
    name: 'Gradio',
    description: 'Create ML web apps in Python with minimal code',
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    id: 'streamlit',
    name: 'Streamlit',
    description: 'Build data apps with Python',
    icon: <Box className="w-6 h-6" />,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Use Docker or static files for complete control',
    icon: <Cpu className="w-6 h-6" />,
  },
];

interface SdkSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SdkSelect({ value, onChange, error }: SdkSelectProps) {
  return (
    <FormField
      label="Select SDK"
      error={error}
      tooltip="Choose the framework for your Space"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SDK_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`p-4 rounded-lg border-2 text-left transition-colors
                      ${value === option.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                      }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {option.icon}
              <span className="font-medium">{option.name}</span>
            </div>
            <p className="text-sm text-gray-400">{option.description}</p>
          </button>
        ))}
      </div>
    </FormField>
  );
}