import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../atoms';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Logo className="h-8 w-auto" />
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">{t('footer.copyright', { year: currentYear })}</span>
              <span className="mx-2">•</span>
              <span>HotelFlow</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('footer.tagline')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;