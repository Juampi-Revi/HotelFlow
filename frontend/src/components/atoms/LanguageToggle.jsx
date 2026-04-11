import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = ({ className = '' }) => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === 'en' ? 'EN' : 'ES';
  const nextLang = i18n.language === 'en' ? t('common.spanish') : t('common.english');

  return (
    <button
      onClick={toggleLanguage}
      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
        text-gray-700 dark:text-gray-300 ${className}`}
      aria-label={t('common.switchTo', { language: nextLang })}
      title={`${t('common.language')}: ${nextLang}`}
    >
      {currentLang}
    </button>
  );
};

export default LanguageToggle;
