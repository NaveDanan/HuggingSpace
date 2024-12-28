import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { ImageUpload } from '../profile/ImageUpload';
import { FormField } from '../ui/FormField';
import { GitHubLinking } from './GitHubLinking';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { OrganizationsSection } from './OrganizationsSection';
import { InterestsSection } from './InterestsSection';

export function ProfileSettings() {
  const { profile, updateProfile, loading, error } = useProfile();
  const { connectGitHub, isConnecting } = useGitHubAuth();
  const [organizations, setOrganizations] = useState<Array<{ id: string; name: string; role: string }>>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);
    setSubmitError(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await updateProfile({
        username: formData.get('username') as string,
        display_name: formData.get('displayName') as string,
        bio: formData.get('bio') as string,
        website_url: formData.get('websiteUrl') as string,
        github_url: profile?.github_url,
        avatar_url: profile?.avatar_url,
        organizations: organizations,
        interests: interests
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update local state when profile changes
  React.useEffect(() => {
    if (profile) {
      setOrganizations(profile.organizations || []);
      setInterests(profile.interests || []);
    }
  }, [profile]);

  if (loading || !profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Profile Picture" tooltip="Upload a profile picture">
          <ImageUpload
            value={profile?.avatar_url || ''}
            onChange={async (url) => {
              await updateProfile({ avatar_url: url });
            }}
          />
        </FormField>

        <FormField label="Username" tooltip="Your unique username">
          <input
            type="text"
            name="username"
            defaultValue={profile?.username}
            required
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent"
          />
        </FormField>

        <FormField label="Display Name" tooltip="Your public display name">
          <input
            type="text"
            name="displayName"
            defaultValue={profile?.display_name || ''}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent"
          />
        </FormField>

        <FormField label="Bio" tooltip="Tell others about yourself">
          <textarea
            name="bio"
            defaultValue={profile?.bio || ''}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent min-h-[100px] resize-y"
          />
        </FormField>

        <FormField label="Website URL" tooltip="Link to your personal website">
          <input
            type="url"
            name="websiteUrl"
            defaultValue={profile?.website_url || ''}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                     focus:border-transparent"
          />
        </FormField>

        <div className="border-t dark:border-gray-700 my-8 pt-8">
          <OrganizationsSection
            organizations={organizations}
            onChange={setOrganizations}
          />
        </div>

        <div className="border-t dark:border-gray-700 my-8 pt-8">
          <InterestsSection
            selectedInterests={interests}
            onChange={setInterests}
          />
        </div>

        <div className="border-t dark:border-gray-700 my-8 pt-8">
          <GitHubLinking
            onConnect={connectGitHub}
            isConnected={!!profile?.github_url}
            isLoading={isConnecting}
          />
        </div>

        {(error || submitError) && (
          <p className="text-red-600 dark:text-red-400 text-sm">{submitError || error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   dark:focus:ring-offset-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}