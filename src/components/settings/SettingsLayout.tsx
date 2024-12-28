import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Key, Palette, UserCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '/settings/profile', icon: UserCircle, label: 'Profile' },
  { href: '/settings/account', icon: User, label: 'Account' },
  { href: '/settings/tokens', icon: Key, label: 'Access Tokens' },
  { href: '/settings/theme', icon: Palette, label: 'Theme' },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation Sidebar */}
          <nav className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 space-y-1">
              {navItems.map(({ href, icon: Icon, label }) => (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}