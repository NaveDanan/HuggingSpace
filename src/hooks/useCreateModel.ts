import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultThumbnail } from '../utils/images';

interface ModelFormData {
  name: string;
  description: string;
  framework: string;
  task: string;
  language: string;
  isPrivate: boolean;
}

interface ModelFormErrors {
  name?: string;
  description?: string;
  framework?: string;
  task?: string;
  language?: string;
  submit?: string;
}

const initialFormData: ModelFormData = {
  name: '',
  description: '',
  framework: 'pytorch',
  task: 'text-generation',
  language: 'python',
  isPrivate: false,
};

export function useCreateModel() {
  const [formData, setFormData] = useState<ModelFormData>(initialFormData);
  const [errors, setErrors] = useState<ModelFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ModelFormErrors = {};

    if (!user) {
      newErrors.submit = 'You must be logged in to create a model';
      setErrors(newErrors);
      return false;
    }

    if (!formData.name) {
      newErrors.name = 'Model name is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = 'Model name can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.framework) {
      newErrors.framework = 'Please select a framework';
    }

    if (!formData.task) {
      newErrors.task = 'Please select a task';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create the model
      const { data: model, error: modelError } = await supabase.from('models').insert({
        title: formData.name,
        description: formData.description,
        framework: formData.framework,
        author_id: user!.id,
        thumbnail_url: getDefaultThumbnail('model'),
        is_private: formData.isPrivate,
      }).select().single();

      if (modelError) throw modelError;

      // Add tags
      const tags = [
        formData.task.toLowerCase(),
        formData.language.toLowerCase(),
        formData.framework.toLowerCase()
      ];

      const { error: tagsError } = await supabase.from('model_tags').insert(
        tags.map(tag => ({
          model_id: model.id,
          tag
        }))
      );

      if (tagsError) throw tagsError;

      navigate('/models');
    } catch (err) {
      console.error('Error creating model:', err);
      setErrors({ 
        submit: 'Failed to create model. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isValid: formData.name && formData.description && formData.framework && formData.task && user,
    isLoading,
    handleSubmit,
  };
}