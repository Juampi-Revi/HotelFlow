import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, LanguageToggle, Logo, ThemeToggle } from '../atoms';
import { useAuth } from '../../contexts';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogoClick = () => {
    // Future: Navigate to homepage
  };

  const goToAdmin = () => navigate('/admin');
  const goToProfile = () => navigate(isAdmin ? '/admin/profile' : '/profile');
  const handleLogout = () => { try { logout(); } catch (_) {} navigate('/'); setMenuOpen(false); };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {t('header.home')}
            </Link>
            <Link 
              to="/rooms" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {t('header.hotels')}
            </Link>

            {isAuthenticated && (
              <Link 
                to="/favorites" 
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {t('header.favorites')}
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link 
                to="/admin" 
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {t('header.admin')}
              </Link>
            )}
          </nav>

          {/* Right side - Controls and Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme and Language toggles */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            
            {/* Auth indicator */}
            <div className="flex items-center space-x-2 sm:space-x-4 relative" ref={menuRef}>
              {isAuthenticated ? (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    className="rounded-full shadow-md hover:shadow-lg"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    {(user?.firstName || '') + ' ' + (user?.lastName || '')}
                  </Button>
                  {menuOpen && (
                    <div className="absolute right-0 top-10 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        onClick={goToProfile}
                      >
                        {t('admin.navigation.profile')}
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={handleLogout}
                      >
                        {t('admin.navigation.logout')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <Button 
                    variant="primary" 
                    size="small"
                    className="rounded-full shadow-md hover:shadow-lg"
                  >
                    {t('header.login')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Direct navigation managed via router */}
    </header>
  );
};

export default Header;
