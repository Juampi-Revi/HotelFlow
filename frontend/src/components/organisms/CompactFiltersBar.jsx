import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangePicker } from '../molecules';
import { roomService } from '../../services/roomService';

// Compact filters bar for Rooms page: single row with Destination, Dates, Guests, Search
const CompactFiltersBar = ({ onSearchResults, initialParams }) => {
  const { t } = useTranslation();

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Prefill from initialParams when available (e.g., coming from Home search)
  useEffect(() => {
    if (initialParams) {
      if (initialParams.destination) setDestination(initialParams.destination);
      if (initialParams.guests) setGuests(initialParams.guests);
      if (initialParams.startDate) setStartDate(new Date(initialParams.startDate));
      if (initialParams.endDate) setEndDate(new Date(initialParams.endDate));
    }
  }, [initialParams]);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await roomService.getDestinationSuggestions(query);
      setSuggestions(results);
    } catch (e) {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (destination) {
        fetchSuggestions(destination);
      }
    }, 250);
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

  const handleDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleGuestsChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    setGuests(val);
  };

  const formatDate = (date) => {
    if (!date) return undefined;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    try {
      const searchParams = {
        destination: destination || undefined,
        guests,
        checkIn: formatDate(startDate),
        checkOut: formatDate(endDate),
        page: 0,
        size: 12,
        sortBy: 'pricePerNight',
        sortDirection: 'asc'
      };
      const results = await roomService.searchRooms(searchParams);
      if (onSearchResults) {
        onSearchResults(results, {
          destination,
          guests,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate)
        });
      }
    } catch (e) {
      setError(t('search.error'));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        {/* Destination */}
        <div className="relative md:flex-1">
          <input
            type="text"
            value={destination}
            onChange={handleDestinationChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={t('search.destinationPlaceholder')}
            aria-label={t('search.destinationPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="md:flex-[2]">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            className="items-end"
            disabled={false}
            showLabels={false}
          />
        </div>

        {/* Guests */}
        <div className="md:flex-0">
          <select
            value={guests}
            onChange={handleGuestsChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {[1,2,3,4,5,6,7,8].map(n => (
              <option key={n} value={n}>
                {n} {n === 1 ? t('common.guest') : t('common.guests')}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <div className="md:flex-0">
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {isSearching ? t('search.searching') : t('search.searchButton')}
          </button>
        </div>
      </form>
      {error && (
        <div className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default CompactFiltersBar;
