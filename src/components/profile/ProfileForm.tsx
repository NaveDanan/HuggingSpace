import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { FormField } from '../ui/FormField';
import { ImageUpload } from './ImageUpload';

export function ProfileForm() {
  const { user } = useAuthContext();
  const { profile, updateProfile, loading, error } = useProfile();
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    displayName: profile?.display_name || '',
    avatarUrl: profile?.avatar_url || '',
    bio: profile?.bio || '',
    githubUrl: profile?.github_url || '',
    websiteUrl: profile?.website_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await updateProfile({
      username: formData.username,
      display_name: formData.displayName,
      avatar_url: formData.avatarUrl,
      bio: formData.bio,
      github_url: formData.githubUrl,
      website_url: formData.websiteUrl,
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Profile Picture" tooltip="Upload a profile picture">
        <ImageUpload
          value={formData.avatarUrl}
          onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
        />
      </FormField>

      <FormField label="Username" tooltip="Your unique username">
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2 text-white"
        />
      </FormField>

      <FormField label="Display Name" tooltip="Your public display name">
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2 text-white"
        />
      </FormField>

      <FormField label="Bio" tooltip="Tell others about yourself">
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2 text-white min-h-[100px]"
        />
      </FormField>

      <FormField label="GitHub URL" tooltip="Link to your GitHub profile">
        <input
          type="url"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2 text-white"
        />
      </FormField>

      <FormField label="Website URL" tooltip="Link to your personal website">
        <input
          type="url"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2 text-white"
        />
      </FormField>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                 hover:bg-blue-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}