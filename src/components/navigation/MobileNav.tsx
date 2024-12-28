import React from 'react';
import { Database, Box, FileText } from 'lucide-react';
import { NavLink } from './NavLink';
import { SearchBar } from '../search/SearchBar';

interface MobileNavProps {
  isOpen: boolean;
}

export function MobileNav({ isOpen }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t">
      <div className="px-4 py-2 space-y-1">
        <div className="py-2">
          <SearchBar />
        </div>
        
        <NavLink to="/models" icon={<Database className="w-4 h-4" />}>
          Models
        </NavLink>
        <NavLink to="/datasets" icon={<Box className="w-4 h-4" />}>
          Datasets
        </NavLink>
        <NavLink to="/spaces" icon={<FileText className="w-4 h-4" />}>
          Spaces
        </NavLink>
      </div>
    </div>
  );
}