import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { CreateNewDropdown } from './CreateNewDropdown';
import { UserDropdownMenu } from './UserDropdownMenu';

export function UserMenu() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  if (!user) {
    return (
      <button
        onClick={() => navigate('/auth')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                 hover:bg-blue-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <CreateNewDropdown />
      <UserDropdownMenu />
    </div>
  );
}