import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import BookingPage from './pages/BookingPage/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';
import MyBookingsPage from './pages/MyBookingsPage/MyBookingsPage';
import Toast from './components/atoms/Toast/Toast';

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
  const { t } = useTranslation();

  const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
      const params = new URLSearchParams();
      params.set('returnTo', `${location.pathname}${location.search || ''}`);
      return <Navigate to={`/login?${params.toString()}`} replace />;
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

  const [whatsAppToast, setWhatsAppToast] = useState({ show: false, type: 'info', message: '' });

  const hideWhatsAppToast = () => setWhatsAppToast((prev) => ({ ...prev, show: false }));

  const showWhatsAppToast = (type, message) => setWhatsAppToast({ show: true, type, message });

  const handleWhatsAppClick = (e) => {
    try {
      if (typeof navigator !== 'undefined' && navigator?.onLine === false) {
        e.preventDefault();
        showWhatsAppToast('error', t('whatsapp.toast.offline'));
        return;
      }

      const url = typeof window !== 'undefined' ? window.location.href : '';
      const text = t('whatsapp.defaultMessage', { url });
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

      e.preventDefault();
      const opened = typeof window !== 'undefined' ? window.open(waUrl, '_blank', 'noopener,noreferrer') : null;
      if (!opened) {
        showWhatsAppToast('error', t('whatsapp.toast.popupBlocked'));
        return;
      }
      showWhatsAppToast('success', t('whatsapp.toast.opened'));
    } catch (_) {
      e.preventDefault();
      showWhatsAppToast('error', t('whatsapp.toast.genericError'));
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <a
          href="https://wa.me/"
          onClick={handleWhatsAppClick}
          aria-label={t('whatsapp.ariaLabel')}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg grid place-items-center focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.77 11.77 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.31-1.65a11.87 11.87 0 0 0 5.74 1.47h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.43-8.45ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.74.98.99-3.65-.23-.37a9.87 9.87 0 0 1-1.51-5.26C2.17 6.44 6.61 2 12.06 2a9.82 9.82 0 0 1 6.99 2.89 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.92-9.88 9.92Zm5.41-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.08-.12-.27-.2-.57-.35Z"/>
          </svg>
        </a>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<ProductsPage />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/booking/:roomId" element={<RequireAuth><BookingPage /></RequireAuth>} />
          <Route path="/booking/confirmation/:bookingId" element={<RequireAuth><BookingConfirmation /></RequireAuth>} />
          <Route path="/bookings" element={<RequireAuth><MyBookingsPage /></RequireAuth>} />
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
        <Toast notification={whatsAppToast} onClose={hideWhatsAppToast} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
