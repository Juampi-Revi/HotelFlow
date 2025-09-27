import React from 'react';
import { CategoriesSection, Header, RecommendationsSection, SearchSection } from './components';
import { ThemeProvider } from './contexts';

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      
      <main className="pt-16 min-h-screen">
        <SearchSection />
        <CategoriesSection />
        <RecommendationsSection />
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
