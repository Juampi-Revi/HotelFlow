import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Header, Footer } from '../../components/organisms';
import RoomGrid from '../../components/organisms/RoomGrid';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../contexts';
import LoadingState from '../../components/atoms/LoadingState';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const rooms = await favoriteService.getFavoriteRooms();
        setFavorites(Array.isArray(rooms) ? rooms : []);
      } catch (_) {
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const onFavoritesChanged = () => {
      if (!isAuthenticated) return;
      setIsLoading(true);
      favoriteService.getFavoriteRooms()
        .then((rooms) => setFavorites(Array.isArray(rooms) ? rooms : []))
        .catch(() => setFavorites([]))
        .finally(() => setIsLoading(false));
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('hf:favoritesChanged', onFavoritesChanged);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('hf:favoritesChanged', onFavoritesChanged);
      }
    };
  }, [isAuthenticated]);

  const handleToggleFavorite = async (roomId) => {
    try {
      await favoriteService.removeFavorite(roomId);
      setFavorites(prev => prev.filter(room => room.id !== roomId));
    } catch (_) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('favorites.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('favorites.subtitle')}
            </p>
          </div>

          {favorites.length > 0 ? (
            <RoomGrid
              rooms={favorites}
              favoriteIds={favorites.map(f => f.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {t('favorites.emptyTitle')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {t('favorites.emptyDescription')}
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                {t('favorites.exploreButton')}
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
