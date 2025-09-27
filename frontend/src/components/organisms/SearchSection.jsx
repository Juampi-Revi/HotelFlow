import React from 'react';
import { useTranslation } from 'react-i18next';

export const SearchSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('search.title', 'Find Your Perfect Hotel')}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-200">
          <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {t('search.placeholder', 'Search Component Placeholder')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};