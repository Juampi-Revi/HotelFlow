/**
 * Utility functions for room-related operations
 */

/**
 * Formats price to USD currency format
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Gets the appropriate color classes for room type badges
 * @param {string} type - The room type (SINGLE, DOUBLE, SUITE, etc.)
 * @returns {string} Tailwind CSS classes for styling
 */
export const getRoomTypeColor = (type) => {
  const colors = {
    SINGLE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    DOUBLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    SUITE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    DELUXE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    PRESIDENTIAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
  
  return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
};

/**
 * Gets the appropriate color classes for availability status
 * @param {boolean} isAvailable - Whether the room is available
 * @returns {string} Tailwind CSS classes for styling
 */
export const getAvailabilityColor = (isAvailable) => {
  return isAvailable
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
};

/**
 * Truncates text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Formats guest count with proper pluralization
 * @param {number} count - Number of guests
 * @param {function} t - Translation function
 * @returns {string} Formatted guest count string
 */
export const formatGuestCount = (count, t) => {
  return count === 1 ? `${count} ${t('common.guest')}` : `${count} ${t('common.guests')}`;
};