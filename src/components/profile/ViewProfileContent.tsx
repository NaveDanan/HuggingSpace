import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabs } from './ProfileTabs';
import { ProfileModels } from './ProfileModels';
import { ProfileDatasets } from './ProfileDatasets';
import { ProfileSpaces } from './ProfileSpaces';
import { ProfileInterests } from './ProfileInterests';
import { ProfileOrganizations } from './ProfileOrganizations';

interface ViewProfileContentProps {
  username: string;
}

export function ViewProfileContent({ username }: ViewProfileContentProps) {
  const { profile, loading, error } = useProfile(username);
  const [activeTab, setActiveTab] = useState('spaces');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-600 dark:text-red-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader profile={profile} />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileInterests profile={profile} />
          <ProfileOrganizations />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} profile={profile} />
          
          <div className="mt-6">
            {activeTab === 'spaces' && <ProfileSpaces spaces={profile.recent_spaces || []} />}
            {activeTab === 'models' && <ProfileModels models={profile.recent_models || []} />}
            {activeTab === 'datasets' && <ProfileDatasets datasets={profile.recent_datasets || []} />}
          </div>
        </div>
      </div>
    </div>
  );
}