import { UserAvatar } from '../UserAvatar';
import { Link } from 'react-router-dom';
import { Github, Globe, Settings, Users } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <UserAvatar 
        size="xl" 
        username={profile.username}
        src={profile.avatar_url || undefined}
      />
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
          </div>
          
          {profile.is_current_user && (
            <div className="flex gap-2">
              <Link
                to="/settings"
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 
                         rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 
                         dark:hover:bg-gray-800"
              >
                <Settings className="w-4 h-4 inline-block mr-2" />
                Edit profile
              </Link>
            </div>
          )}
        </div>

        {profile.bio && (
          <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-3xl">{profile.bio}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>Followers {profile.followers_count || 0}</span>
          </div>
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
                       hover:text-gray-900 dark:hover:text-white"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {profile.website_url && (
            <a
              href={profile.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
                       hover:text-gray-900 dark:hover:text-white"
            >
              <Globe className="w-4 h-4" />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}