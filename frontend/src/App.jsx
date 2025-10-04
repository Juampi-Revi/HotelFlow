import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Hero, Footer } from './components';
import RoomGrid from './components/organisms/RoomGrid';
import { ThemeProvider } from './contexts';
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
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<ProductsPage />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/availability" element={<AdminAvailability />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
