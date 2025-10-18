import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Hero, Footer } from './components';
import RoomGrid from './components/organisms/RoomGrid';
import { ThemeProvider, useAuth } from './contexts';
import { roomService } from './services/roomService';
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

function HomePage() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header />
      
      <main className="pt-16 flex-grow">
        <Hero />
        <RoomGrid 
          rooms={rooms}
          title={t('home.featuredRooms')}
          isLoading={isLoading}
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
          {/* OWNER-only user management */}
          <Route path="/admin/users" element={<RequireOwner><AdminUsers /></RequireOwner>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
