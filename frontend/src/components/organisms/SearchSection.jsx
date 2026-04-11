import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DateRangePicker from '../molecules/DateRangePicker';
import { roomService } from '../../services/roomService';
import { formatDateYMD } from '../../utils/roomUtils';

export const SearchSection = ({ onSearchResults }) => {
  const { t } = useTranslation();
  
  const [searchData, setSearchData] = useState({
    destination: '',
    startDate: null,
    endDate: null,
    guests: 1
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const results = await roomService.getDestinationSuggestions(query);
      setSuggestions(results);
    } catch (_) {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchData.destination) {
        fetchSuggestions(searchData.destination);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchData.destination, fetchSuggestions]);

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setSearchData(prev => ({ ...prev, destination: value }));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchData(prev => ({ ...prev, destination: suggestion }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleDateChange = ({ startDate, endDate }) => {
    setSearchData(prev => ({ ...prev, startDate, endDate }));
  };

  const handleGuestsChange = (e) => {
    setSearchData(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    
    try {
      const searchParams = {
        destination: searchData.destination || undefined,
        guests: searchData.guests,
        page: 0,
        size: 12,
        sortBy: 'pricePerNight',
        sortDirection: 'asc'
      };
      const checkIn = formatDateYMD(searchData.startDate);
      const checkOut = formatDateYMD(searchData.endDate);
      if (checkIn && checkOut) {
        searchParams.checkIn = checkIn;
        searchParams.checkOut = checkOut;
      }

      const results = await roomService.searchRooms(searchParams);
      
      if (onSearchResults) {
        onSearchResults(results, {
          destination: searchData.destination || '',
          guests: searchData.guests,
          startDate: checkIn,
          endDate: checkOut
        });
      }
    } catch (e) {
      setError(t('search.error'));
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('search.destination')}
                </label>
                <input
                  type="text"
                  value={searchData.destination}
                  onChange={handleDestinationChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={t('search.destinationPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                
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

              <div className="md:col-span-2">
                <DateRangePicker
                  startDate={searchData.startDate}
                  endDate={searchData.endDate}
                  onDateChange={handleDateChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('search.guests')}
                </label>
                <select
                  value={searchData.guests}
                  onChange={handleGuestsChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? t('search.guest') : t('search.guestsPlural')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSearching}
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
            {error && (
              <div className="text-center text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
