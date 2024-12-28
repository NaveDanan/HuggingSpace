import React from 'react';
import { useCreateSpace } from '../../hooks/useCreateSpace';
import { OwnerSelect } from './OwnerSelect';
import { SpaceNameInput } from './SpaceNameInput';
import { DescriptionInput } from './DescriptionInput';
import { LicenseSelect } from './LicenseSelect';
import { SdkSelect } from './SdkSelect';
import { HardwareSelect } from './HardwareSelect';
import { VisibilityToggle } from './VisibilityToggle';

interface CreateSpaceFormProps {
  onAuthRequired: () => void;
}

export function CreateSpaceForm({ onAuthRequired }: CreateSpaceFormProps) {
  const { 
    formData, 
    setFormData, 
    isValid, 
    errors, 
    handleSubmit, 
    isLoading 
  } = useCreateSpace();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.submit === 'You must be logged in to create a space') {
      onAuthRequired();
      return;
    }
    await handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-6">
        <OwnerSelect
          value={formData.owner}
          onChange={(value) => setFormData({ ...formData, owner: value })}
          error={errors.owner}
        />

        <SpaceNameInput
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
        />

        <DescriptionInput
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          error={errors.description}
        />

        <LicenseSelect
          value={formData.license}
          onChange={(value) => setFormData({ ...formData, license: value })}
          error={errors.license}
        />
      </div>

      <div>
        <SdkSelect
          value={formData.sdk}
          onChange={(value) => setFormData({ ...formData, sdk: value })}
          error={errors.sdk}
        />
      </div>

      <div className="space-y-6">
        <HardwareSelect
          value={formData.hardware}
          onChange={(value) => setFormData({ ...formData, hardware: value })}
          error={errors.hardware}
        />

        <VisibilityToggle
          value={formData.isPrivate}
          onChange={(value) => setFormData({ ...formData, isPrivate: value })}
        />
      </div>

      {errors.submit && (
        <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.submit}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          {isLoading ? 'Creating Space...' : 'Create Space'}
        </button>
      </div>
    </form>
  );
}