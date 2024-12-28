import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { SearchResults } from './SearchResults';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../../types/search';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { results, loading } = useSearch(query);

  const handleSelect = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');
    
    switch (result.type) {
      case 'model':
        navigate(`/models/${result.id}`);
        break;
      case 'dataset':
        navigate(`/datasets/${result.id}`);
        break;
      case 'space':
        navigate(`/spaces/${result.id}`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => {
            // Delay hiding results to allow click events to fire
            setTimeout(() => setShowResults(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search models, datasets, spaces..."
          className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-700 
                   border border-gray-300 dark:border-gray-600 
                   text-gray-900 dark:text-white
                   rounded-lg focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:focus:ring-blue-400 
                   focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showResults && (
        <SearchResults
          results={results}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}