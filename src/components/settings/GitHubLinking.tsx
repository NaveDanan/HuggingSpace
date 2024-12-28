import React from 'react';
import { Github } from 'lucide-react';

interface GitHubLinkingProps {
  onConnect: () => void;
  isConnected?: boolean;
  isLoading?: boolean;
}

export function GitHubLinking({ onConnect, isConnected = false, isLoading = false }: GitHubLinkingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Link Account</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Connect your GitHub account</p>
        </div>
        <button
          onClick={onConnect}
          disabled={isLoading || isConnected}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white 
                   rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Github className="w-5 h-5" />
          {isConnected ? 'Connected' : isLoading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
      
      {isConnected && (
        <p className="text-sm text-green-600 dark:text-green-400">
          ✓ Your GitHub account is connected
        </p>
      )}
    </div>
  );
}