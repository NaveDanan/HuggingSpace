import React from 'react';
import { useCreateModel } from '../../hooks/useCreateModel';
import { FormField } from '../ui/FormField';
import { ModelFrameworkSelect } from './ModelFrameworkSelect';
import { ModelTaskSelect } from './ModelTaskSelect';
import { ModelLanguageSelect } from './ModelLanguageSelect';
import { VisibilityToggle } from '../create-space/VisibilityToggle';

export function CreateModelForm() {
  const { formData, setFormData, isValid, errors, handleSubmit, isLoading } = useCreateModel();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <FormField
          label="Model Name"
          error={errors.name}
          tooltip="Choose a unique name for your model"
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="my-awesome-model"
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent"
          />
        </FormField>

        <FormField
          label="Description"
          error={errors.description}
          tooltip="Briefly describe what your model does"
        >
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A short description of your model..."
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent min-h-[100px] resize-y"
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <ModelFrameworkSelect
          value={formData.framework}
          onChange={(value) => setFormData({ ...formData, framework: value })}
          error={errors.framework}
        />

        <ModelTaskSelect
          value={formData.task}
          onChange={(value) => setFormData({ ...formData, task: value })}
          error={errors.task}
        />

        <ModelLanguageSelect
          value={formData.language}
          onChange={(value) => setFormData({ ...formData, language: value })}
          error={errors.language}
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
                   focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          {isLoading ? 'Creating Model...' : 'Create Model'}
        </button>
      </div>
    </form>
  );
}