import React from 'react';
import { useTranslation } from 'react-i18next';

export const CategoriesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          {t('categories.title', 'Hotel Categories')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transition-colors duration-200 hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-300 font-bold text-xl">
                  {item}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t(`categories.item${item}`, `Category ${item}`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('categories.placeholder', 'Category description')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};