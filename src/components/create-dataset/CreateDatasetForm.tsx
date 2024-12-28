import React from 'react';
import { useCreateDataset } from '../../hooks/useCreateDataset';
import { FormField } from '../ui/FormField';
import { DatasetTypeSelect } from './DatasetTypeSelect';
import { DatasetFormatSelect } from './DatasetFormatSelect';
import { DatasetSizeInput } from './DatasetSizeInput';
import { VisibilityToggle } from '../create-space/VisibilityToggle';

export function CreateDatasetForm() {
  const { formData, setFormData, isValid, errors, handleSubmit, isLoading } = useCreateDataset();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <FormField
          label="Dataset Name"
          error={errors.name}
          tooltip="Choose a unique name for your dataset"
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="my-awesome-dataset"
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent"
          />
        </FormField>

        <FormField
          label="Description"
          error={errors.description}
          tooltip="Briefly describe your dataset"
        >
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A short description of your dataset..."
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent min-h-[100px] resize-y"
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <DatasetTypeSelect
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          error={errors.type}
        />

        <DatasetFormatSelect
          value={formData.format}
          onChange={(value) => setFormData({ ...formData, format: value })}
          error={errors.format}
        />

        <DatasetSizeInput
          value={formData.size}
          onChange={(value) => setFormData({ ...formData, size: value })}
          error={errors.size}
        />
      </div>

      <div>
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
                   focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          {isLoading ? 'Creating Dataset...' : 'Create Dataset'}
        </button>
      </div>
    </form>
  );
}