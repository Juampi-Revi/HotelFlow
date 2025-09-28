import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, LanguageToggle, Logo, ThemeToggle } from '../atoms';

const Header = () => {
  const { t } = useTranslation();

  const handleLogoClick = () => {
    // Future: Navigate to homepage
  };

  const handleCreateAccountClick = () => {
    // Future: Open create account modal/page
  };

  const handleLoginClick = () => {
    // Future: Open login modal/page
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Brand */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <Link to="/" className="flex flex-col">
              <Logo size="lg" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                {t('brand.tagline')}
              </div>
            </Link>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/rooms" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {t('nav.rooms')}
            </Link>
          </nav>

          {/* Right side - Controls and Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme and Language toggles */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCreateAccountClick}
                className="hidden sm:block"
              >
                {t('header.signup')}
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleLoginClick}
              >
                {t('header.login')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;