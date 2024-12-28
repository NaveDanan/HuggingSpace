import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SearchBar } from './search/SearchBar';
import { MainNav } from './navigation/MainNav';
import { MobileNav } from './navigation/MobileNav';
import { UserMenu } from './navigation/UserMenu';
import { useTheme } from '../contexts/ThemeContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap"
              >
                <img 
                  src="/src/images/HuggingSpace_logo_2.ico" 
                  alt="HuggingSpace Logo"
                  className="w-8 h-8"
                />
                HuggingSpace
              </button>
            </div>

            {/* Center section - Main Navigation */}
            <div className="flex items-center flex-1 gap-4">

                  <div className="hidden sm:block flex-1 ml-2">
                  <SearchBar />
                  </div>
              
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <MainNav />
              <UserMenu />
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav isOpen={mobileMenuOpen} />
      </header>

      {children}
    </div>
  );
}