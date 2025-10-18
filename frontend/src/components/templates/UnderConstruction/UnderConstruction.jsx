import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout/AdminLayout';

const UnderConstruction = ({ 
  title = null, 
  message = null, 
  showBackButton = true 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title || t('underConstruction.title')}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {message || t('underConstruction.message')}
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-center justify-center mb-3">
              <svg 
                className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {t('underConstruction.info.title')}
              </h3>
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              {t('underConstruction.info.description')}
            </p>
          </div>

          {showBackButton && (
            <button
              onClick={handleBackToAdmin}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-blue-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center space-x-3">
                <svg 
                  className="w-5 h-5" 
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
                <span>{t('underConstruction.backToAdmin')}</span>
              </span>
            </button>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('underConstruction.contact')}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UnderConstruction;