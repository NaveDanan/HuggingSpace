import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserAvatar } from '../UserAvatar';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useProfile } from '../../hooks/useProfile';

export function UserDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const { profile } = useProfile();

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80"
      >
        <UserAvatar 
          src={profile?.avatar_url || undefined}
          username={profile?.username}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50
                      border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              navigate(`/profile/${profile?.username}`);
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <User className="w-4 h-4" />
            View Profile
          </button>

          <button
            onClick={() => {
              navigate('/settings/profile');
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400
                     hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}