import React from 'react';
import { FormField } from '../ui/FormField';
import { Sparkles } from 'lucide-react';

const AI_ML_INTERESTS = [
  'Natural Language Processing',
  'Computer Vision',
  'Reinforcement Learning',
  'Deep Learning',
  'Machine Learning',
  'Neural Networks',
  'Generative AI',
  'MLOps',
  'AI Ethics',
  'Robotics'
];

interface InterestsSectionProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
}

export function InterestsSection({ selectedInterests = [], onChange }: InterestsSectionProps) {
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter(i => i !== interest));
    } else {
      onChange([...selectedInterests, interest]);
    }
  };

  return (
    <FormField 
      label="AI & ML Interests" 
      tooltip="Select your areas of interest in AI and Machine Learning"
    >
      <div className="flex flex-wrap gap-2">
        {AI_ML_INTERESTS.map(interest => (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              selectedInterests.includes(interest)
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
    </FormField>
  );
}