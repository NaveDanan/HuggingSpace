import React from 'react';
import { FormField } from '../ui/FormField';

interface OwnerSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OwnerSelect({ value, onChange, error }: OwnerSelectProps) {
  return (
    <FormField
      label="Owner"
      error={error}
      tooltip="Choose who will own this Space"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2
                 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="personal">Personal Account</option>
        <option value="organization">Organization</option>
      </select>
    </FormField>
  );
}