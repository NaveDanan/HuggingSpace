import React from 'react';
import { FormField } from '../ui/FormField';
import { Cpu, Zap, Rocket } from 'lucide-react';

interface HardwareOption {
  id: string;
  name: string;
  description: string;
  specs: string;
  icon: React.ReactNode;
}

const HARDWARE_OPTIONS: HardwareOption[] = [
  {
    id: 'cpu-basic',
    name: 'CPU Basic',
    description: 'Good for most applications',
    specs: '2 vCPU • 16 GB RAM',
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: 'cpu-boost',
    name: 'CPU Boost',
    description: 'For compute-intensive tasks',
    specs: '4 vCPU • 32 GB RAM',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: 'gpu',
    name: 'GPU',
    description: 'For ML model inference',
    specs: 'T4 GPU • 16 GB VRAM',
    icon: <Rocket className="w-6 h-6" />,
  },
];

interface HardwareSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function HardwareSelect({ value, onChange, error }: HardwareSelectProps) {
  return (
    <FormField
      label="Hardware"
      error={error}
      tooltip="Choose the computing resources for your Space"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {HARDWARE_OPTIONS.map((option) => (
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
            <p className="text-sm text-gray-400 mb-1">{option.description}</p>
            <p className="text-xs text-gray-500">{option.specs}</p>
          </button>
        ))}
      </div>
    </FormField>
  );
}