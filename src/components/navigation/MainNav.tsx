import React from 'react';
import { Database, Box, FileText } from 'lucide-react';
import { NavLink } from './NavLink';

export function MainNav() {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      <NavLink to="/models" icon={<Database className="w-4 h-4" />}>
        Models
      </NavLink>
      <NavLink to="/datasets" icon={<Box className="w-4 h-4" />}>
        Datasets
      </NavLink>
      <NavLink to="/spaces" icon={<FileText className="w-4 h-4" />}>
        Spaces
      </NavLink>
    </nav>
  );
}