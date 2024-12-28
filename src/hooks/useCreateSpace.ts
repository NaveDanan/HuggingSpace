import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultThumbnail } from '../utils/images';

interface SpaceFormData {
  owner: string;
  name: string;
  description: string;
  license: string;
  sdk: string;
  hardware: string;
  isPrivate: boolean;
}

interface SpaceFormErrors {
  owner?: string;
  name?: string;
  description?: string;
  license?: string;
  sdk?: string;
  hardware?: string;
  submit?: string;
}

const initialFormData: SpaceFormData = {
  owner: 'personal',
  name: '',
  description: '',
  license: 'apache-2.0',
  sdk: 'gradio',
  hardware: 'cpu-basic',
  isPrivate: false,
};

export function useCreateSpace() {
  const [formData, setFormData] = useState<SpaceFormData>(initialFormData);
  const [errors, setErrors] = useState<SpaceFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: SpaceFormErrors = {};

    if (!user) {
      newErrors.submit = 'You must be logged in to create a space';
      setErrors(newErrors);
      return false;
    }

    if (!formData.name) {
      newErrors.name = 'Space name is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = 'Space name can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.sdk) {
      newErrors.sdk = 'Please select an SDK';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create the space
      const { data: space, error: spaceError } = await supabase.from('spaces').insert({
        title: formData.name,
        description: formData.description,
        framework: formData.sdk,
        type: 'space',
        author_id: user!.id,
        thumbnail_url: getDefaultThumbnail('space'),
        is_private: formData.isPrivate,
      }).select().single();

      if (spaceError) throw spaceError;

      // Add tags
      const tags = ['space', formData.sdk.toLowerCase(), formData.hardware.toLowerCase()];

      const { error: tagsError } = await supabase.from('space_tags').insert(
        tags.map(tag => ({
          space_id: space.id,
          tag
        }))
      );

      if (tagsError) throw tagsError;

      navigate(`/spaces/${formData.name}`);
    } catch (err) {
      console.error('Error creating space:', err);
      setErrors({ submit: 'Failed to create space. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = formData.name && formData.description && formData.sdk && user;

  return {
    formData,
    setFormData,
    errors,
    isValid,
    isLoading,
    handleSubmit,
  };
}