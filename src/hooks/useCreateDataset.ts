import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultThumbnail } from '../utils/images';

interface DatasetFormData {
  name: string;
  description: string;
  type: string;
  format: string;
  size: string;
  isPrivate: boolean;
}

interface DatasetFormErrors {
  name?: string;
  description?: string;
  type?: string;
  format?: string;
  size?: string;
  submit?: string;
}

const initialFormData: DatasetFormData = {
  name: '',
  description: '',
  type: 'tabular',
  format: 'csv',
  size: 'small',
  isPrivate: false,
};

export function useCreateDataset() {
  const [formData, setFormData] = useState<DatasetFormData>(initialFormData);
  const [errors, setErrors] = useState<DatasetFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: DatasetFormErrors = {};

    if (!user) {
      newErrors.submit = 'You must be logged in to create a dataset';
      setErrors(newErrors);
      return false;
    }

    if (!formData.name) {
      newErrors.name = 'Dataset name is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = 'Dataset name can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create the dataset
      const { data: dataset, error: datasetError } = await supabase.from('datasets').insert({
        title: formData.name,
        description: formData.description,
        type: formData.type,
        format: formData.format,
        size: formData.size,
        author_id: user!.id,
        thumbnail_url: getDefaultThumbnail('dataset'),
        is_private: formData.isPrivate,
      }).select().single();

      if (datasetError) throw datasetError;

      // Add tags
      const tags = [
        formData.type.toLowerCase(),
        formData.format.toLowerCase(),
        `size:${formData.size.toLowerCase()}`
      ];

      const { error: tagsError } = await supabase.from('dataset_tags').insert(
        tags.map(tag => ({
          dataset_id: dataset.id,
          tag
        }))
      );

      if (tagsError) throw tagsError;

      navigate('/datasets');
    } catch (err) {
      console.error('Error creating dataset:', err);
      setErrors({ 
        submit: 'Failed to create dataset. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isValid: formData.name && formData.description && user,
    isLoading,
    handleSubmit,
  };
}