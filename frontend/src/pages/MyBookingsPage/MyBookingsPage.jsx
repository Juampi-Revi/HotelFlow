import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Footer } from '../../components/organisms';
import LoadingState from '../../components/atoms/LoadingState';
import ErrorState from '../../components/atoms/ErrorState';
import Toast from '../../components/atoms/Toast/Toast';
import { bookingService } from '../../services/bookingService';
import { useToast } from '../../hooks';
import { formatPrice } from '../../utils/roomUtils';

const getTodayYMD = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const isCancellable = (booking) => {
  if (!booking) return false;
  if (booking.status !== 'CONFIRMED') return false;
  const checkIn = String(booking.checkInDate || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn)) return false;
  const today = getTodayYMD();
  return checkIn >= today;
};

const isDeletable = (booking) => {
  if (!booking) return false;
  return booking.status === 'CANCELLED' || booking.status === 'COMPLETED';
};

const MyBookingsPage = () => {
  const { t, i18n } = useTranslation();
  const { notification, showNotification, hideNotification } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const formatDateYMDForDisplay = (ymd) => {
    const value = String(ymd || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || '-';
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return value;
    const locale = (i18n?.language || '').startsWith('es') ? 'es-ES' : 'en-GB';
    return new Intl.DateTimeFormat(locale).format(d);
  };

  const formatDateTimeForDisplay = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    const locale = (i18n?.language || '').startsWith('es') ? 'es-ES' : 'en-GB';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(d);
  };

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const active = [];
    const history = [];
    const today = getTodayYMD();
    for (const b of bookings) {
      const checkOut = String(b?.checkOutDate || '');
      const hasValidDates = /^\d{4}-\d{2}-\d{2}$/.test(checkOut);
      const isPast = hasValidDates ? checkOut <= today : b?.status !== 'CONFIRMED';
      if (b?.status === 'CONFIRMED' && !isPast) active.push(b);
      else history.push(b);
    }
    active.sort((a, b) => String(b?.checkInDate || '').localeCompare(String(a?.checkInDate || '')));
    history.sort((a, b) => String(b?.checkInDate || '').localeCompare(String(a?.checkInDate || '')));
    return { active, history };
  }, [bookings]);

  const handleCancel = async (bookingId) => {
    if (!bookingId) return;
    try {
      setCancellingId(bookingId);
      await bookingService.cancelMyBooking(bookingId);
      showNotification('success', t('myBookings.cancel.success'));
      await load();
    } catch (e) {
      showNotification('error', e?.message || t('myBookings.cancel.error'));
    } finally {
      setCancellingId(null);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!bookingId) return;
    try {
      setDeletingId(bookingId);
      await bookingService.deleteMyBooking(bookingId);
      showNotification('success', t('myBookings.delete.success'));
      await load();
    } catch (e) {
      showNotification('error', e?.message || t('myBookings.delete.error'));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onBack={() => window.history.back()} />;

  const renderBooking = (b) => (
    <div key={b.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-28 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shrink-0">
            {b.imageUrl ? (
              <img src={b.imageUrl} alt={b.hotelName || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs text-gray-600 dark:text-gray-300">
                {t('common.noImages')}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {b.hotelName || t('common.room')}
            </div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {b.city}{b.city && b.country ? ', ' : ''}{b.country}
            </div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{t('myBookings.fields.dates')}:</span>{' '}
              {formatDateYMDForDisplay(b.checkInDate)} → {formatDateYMDForDisplay(b.checkOutDate)}
            </div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{t('myBookings.fields.bookingDate')}:</span>{' '}
              {formatDateTimeForDisplay(b.createdAt)}
            </div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{t('myBookings.fields.guests')}:</span>{' '}
              {b.numberOfGuests}
            </div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{t('myBookings.fields.total')}:</span>{' '}
              {formatPrice(b.totalPrice)}
            </div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {t('myBookings.fields.status')}: {b.status}
            </div>
            {b.specialRequests ? (
              <div className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold">{t('myBookings.fields.requests')}:</span>{' '}
                {b.specialRequests}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          {b.roomId && (
            <Link
              to={`/room/${b.roomId}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              {t('myBookings.actions.viewRoom')}
            </Link>
          )}
          {isCancellable(b) && (
            <button
              type="button"
              onClick={() => handleCancel(b.id)}
              disabled={cancellingId === b.id}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20 transition-colors"
            >
              {cancellingId === b.id ? t('myBookings.actions.cancelling') : t('myBookings.actions.cancel')}
            </button>
          )}
          {isDeletable(b) && (
            <button
              type="button"
              onClick={() => handleDelete(b.id)}
              disabled={deletingId === b.id}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {deletingId === b.id ? t('myBookings.actions.deleting') : t('myBookings.actions.delete')}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('myBookings.title')}
            </h1>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              {t('myBookings.actions.refresh')}
            </button>
          </div>

          {!bookings.length ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-10 text-center">
              <div className="text-slate-700 dark:text-slate-300">
                {t('myBookings.empty')}
              </div>
              <div className="mt-5">
                <Link
                  to="/rooms"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {t('myBookings.actions.explore')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.active.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t('myBookings.sections.confirmed')}
                  </h2>
                  <div className="space-y-3">
                    {grouped.active.map(renderBooking)}
                  </div>
                </section>
              )}
              {grouped.history.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t('myBookings.sections.history')}
                  </h2>
                  <div className="space-y-3">
                    {grouped.history.map(renderBooking)}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Toast notification={notification} onClose={hideNotification} />
    </div>
  );
};

export default MyBookingsPage;
