import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components';
import { ThemeProvider } from './contexts';

function AppContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />

      {/* Main Content - Placeholder for future development */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('common.welcome')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {t('brand.tagline')}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto transition-colors duration-200">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                {t('common.comingSoon')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('common.description')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App
