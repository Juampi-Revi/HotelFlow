import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorState = ({ error, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{t('common.error')}: {error}</p>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          {t('common.goBack')}
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
