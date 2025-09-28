import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MobileNotSupported = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 p-8 text-center">
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-blue-500 dark:text-blue-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t('admin.mobileNotSupported.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('admin.mobileNotSupported.description')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/50">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              {t('admin.mobileNotSupported.requirements.title')}
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>{t('admin.mobileNotSupported.requirements.desktop')}</li>
              <li>{t('admin.mobileNotSupported.requirements.resolution')}</li>
              <li>{t('admin.mobileNotSupported.requirements.browser')}</li>
            </ul>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            {t('admin.mobileNotSupported.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNotSupported;