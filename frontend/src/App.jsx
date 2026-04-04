import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Hero, Footer, SearchSection, RecommendationsSection } from './components';
import RoomGrid from './components/organisms/RoomGrid';
import { ThemeProvider, useAuth } from './contexts';
import { roomService } from './services/roomService';
import { favoriteService } from './services/favoriteService';
import Admin from './pages/Admin/Admin';
import AdminRooms from './pages/AdminRooms/AdminRooms';
import AdminAnalytics from './pages/AdminAnalytics/AdminAnalytics';
import AdminBookings from './pages/AdminBookings/AdminBookings';
import AdminAvailability from './pages/AdminAvailability/AdminAvailability';
import AdminCustomers from './pages/AdminCustomers/AdminCustomers';
import AdminStaff from './pages/AdminStaff/AdminStaff';
import AdminSettings from './pages/AdminSettings/AdminSettings';
import AdminCategories from './pages/AdminCategories/AdminCategories';
import AdminProfile from './pages/AdminProfile/AdminProfile';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import RoomDetail from './pages/RoomDetail';
import Auth from './pages/Auth/Auth';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import AdminFeatures from './pages/AdminFeatures/AdminFeatures';

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const data = await roomService.getRoomsForHome();
        setRooms(data);
      } catch (error) {
        // Error handled silently - rooms will remain empty array
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const ids = await favoriteService.getFavorites();
          setFavoriteIds(Array.isArray(ids) ? ids : []);
        } catch (_) {}
      } else {
        setFavoriteIds([]);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    const onFavoritesChanged = (e) => {
      const detail = e?.detail;
      const roomId = Number(detail?.roomId);
      if (!roomId || !isAuthenticated) return;
      setFavoriteIds((prev) => {
        if (detail?.action === 'add') {
          return prev.includes(roomId) ? prev : [...prev, roomId];
        }
        if (detail?.action === 'remove') {
          return prev.filter((id) => id !== roomId);
        }
        return prev;
      });
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
    if (!isAuthenticated) return;

    try {
      if (favoriteIds.includes(roomId)) {
        await favoriteService.removeFavorite(roomId);
        setFavoriteIds(prev => prev.filter(id => id !== roomId));
      } else {
        await favoriteService.addFavorite(roomId);
        setFavoriteIds(prev => [...prev, roomId]);
      }
    } catch (_) {}
  };

  const handleSearchResults = (results, searchParams) => {
    navigate('/rooms', {
      state: {
        fromSearch: true,
        searchResults: results,
        searchParams
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header />
      
      <main className="pt-16 flex-grow">
        <Hero />
        <SearchSection onSearchResults={handleSearchResults} />
        <RecommendationsSection favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} />
        <RoomGrid 
          rooms={rooms}
          title={t('home.featuredRooms')}
          isLoading={isLoading}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const RequireAdmin = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const RequireOwner = ({ children }) => {
    const { isAuthenticated, isOwner } = useAuth();
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!isOwner) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<ProductsPage />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><AdminProfile /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/admin/rooms" element={<RequireAdmin><AdminRooms /></RequireAdmin>} />
          <Route path="/admin/analytics" element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />
          <Route path="/admin/bookings" element={<RequireAdmin><AdminBookings /></RequireAdmin>} />
          <Route path="/admin/availability" element={<RequireAdmin><AdminAvailability /></RequireAdmin>} />
          <Route path="/admin/customers" element={<RequireAdmin><AdminCustomers /></RequireAdmin>} />
          <Route path="/admin/staff" element={<RequireAdmin><AdminStaff /></RequireAdmin>} />
          <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
          <Route path="/admin/profile" element={<RequireAdmin><AdminProfile /></RequireAdmin>} />
          <Route path="/admin/categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
          <Route path="/admin/features" element={<RequireAdmin><AdminFeatures /></RequireAdmin>} />
          {/* OWNER-only user management */}
          <Route path="/admin/users" element={<RequireOwner><AdminUsers /></RequireOwner>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
