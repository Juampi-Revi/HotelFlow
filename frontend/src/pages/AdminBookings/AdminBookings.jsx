import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import Toast from '../../components/atoms/Toast/Toast';
import { bookingService } from '../../services/bookingService';
import { useToast } from '../../hooks';

const AdminBookings = () => {
  const { t } = useTranslation();
  const { notification, showNotification, hideNotification } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookingService.getAdminBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e?.message || t('common.error');
      setError(msg);
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) => {
      const fields = [
        String(b?.id ?? ''),
        String(b?.roomId ?? ''),
        String(b?.roomNumber ?? ''),
        String(b?.hotelName ?? ''),
        String(b?.city ?? ''),
        String(b?.country ?? ''),
        String(b?.checkInDate ?? ''),
        String(b?.checkOutDate ?? ''),
        String(b?.status ?? '')
      ].join(' ').toLowerCase();
      return fields.includes(q);
    });
  }, [bookings, query]);

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {t('admin.navigation.bookings')}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {t('admin.dashboard.items.bookingsDesc')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder={t('common.search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={load}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {t('myBookings.actions.refresh')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-gray-600 dark:text-gray-300">{t('common.loading')}</div>
          ) : error ? (
            <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded">{error}</div>
          ) : !filtered.length ? (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              {t('search.noResults')}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.room')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.location')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('myBookings.fields.dates')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('myBookings.fields.status')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{b.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <div className="font-semibold">{b.hotelName || '-'}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t('common.roomNumber')}: {b.roomNumber || '-'} (#{b.roomId || '-'})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                        {b.city}{b.city && b.country ? ', ' : ''}{b.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                        {b.checkInDate} → {b.checkOutDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                        {b.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Toast notification={notification} onClose={hideNotification} />
    </AdminLayout>
  );
};

export default AdminBookings;
