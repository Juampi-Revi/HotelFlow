import React from 'react';
import { useTranslation } from 'react-i18next';

export const RecommendationsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          {t('recommendations.title', 'Recommended Hotels')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200 hover:shadow-xl"
            >
              <div className="h-48 bg-gradient-to-br from-primary-200 to-secondary-200 dark:from-primary-700 dark:to-secondary-700 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {t('recommendations.imagePlaceholder', 'Hotel Image')}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t(`recommendations.hotel${item}`, `Recommended Hotel ${item}`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('recommendations.description', 'Hotel description placeholder')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">
                    {t('recommendations.price', '$99/night')}
                  </span>
                  <span className="text-yellow-500">
                    ★★★★☆
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};