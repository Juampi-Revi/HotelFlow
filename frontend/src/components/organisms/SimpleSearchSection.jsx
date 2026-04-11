import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { roomService } from '../../services/roomService';

export const SimpleSearchSection = ({ onSearchResults }) => {
  const { t } = useTranslation();
  
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const results = await roomService.getDestinationSuggestions(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (destination) {
        fetchSuggestions(destination);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [destination, fetchSuggestions]);

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setDestination(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;
    
    setIsSearching(true);
    
    try {
      const searchParams = {
        destination: destination || undefined,
        guests: 1,
        page: 0,
        size: 12,
        sortBy: 'pricePerNight',
        sortDirection: 'asc'
      };

      const results = await roomService.searchRooms(searchParams);
      
      if (onSearchResults) {
        onSearchResults(results, { destination });
      }
    } catch (error) {
      console.error('Error searching rooms:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('search.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('search.description')}
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-200">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Destination Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={t('search.destinationPlaceholder')}
                  aria-label={t('search.destinationPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSearching || !destination.trim()}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('search.searching')}</span>
                    </>
                  ) : (
                    <span>{t('search.searchButton')}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
