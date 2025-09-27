import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CategoriesSection, Header, RecommendationsSection, SearchSection } from './components';
import { ThemeProvider } from './contexts';
import Admin from './pages/Admin/Admin';
import AdminRooms from './pages/AdminRooms/AdminRooms';

function HomePage() {
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
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
