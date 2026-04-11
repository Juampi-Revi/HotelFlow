import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Footer } from '../../components/organisms';
import LoadingState from '../../components/atoms/LoadingState';
import ErrorState from '../../components/atoms/ErrorState';
import { bookingService } from '../../services/bookingService';
import { formatPrice } from '../../utils/roomUtils';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await bookingService.getMyBooking(bookingId);
        setBooking(data);
      } catch (err) {
        let message = '';
        try {
          const parsed = JSON.parse(err?.message || '');
          message = parsed?.message || '';
        } catch (_) {}
        setError(message || err?.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, t]);

  const goHome = () => navigate('/');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onBack={goHome} />;

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 pt-16 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 grid place-items-center">
                <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t('booking.success.title')}
                </h1>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {t('booking.success.subtitle')}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                <div className="text-slate-600 dark:text-slate-400">{t('booking.confirmation.product')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {booking?.hotelName || booking?.roomNumber || '-'}
                </div>
              </div>
              <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                <div className="text-slate-600 dark:text-slate-400">{t('booking.confirmation.dates')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {formatDateYMDForDisplay(booking?.checkInDate)} → {formatDateYMDForDisplay(booking?.checkOutDate)}
                </div>
              </div>
              <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                <div className="text-slate-600 dark:text-slate-400">{t('booking.confirmation.guests')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {booking?.numberOfGuests ?? '-'}
                </div>
              </div>
              <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                <div className="text-slate-600 dark:text-slate-400">{t('booking.confirmation.status')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {booking?.status || '-'}
                </div>
              </div>
              <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                <div className="text-slate-600 dark:text-slate-400">{t('booking.confirmation.bookingDate')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {formatDateTimeForDisplay(booking?.createdAt)}
                </div>
              </div>
              <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                <div className="text-slate-600 dark:text-slate-400">{t('booking.confirmation.total')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {typeof booking?.totalPrice === 'number' ? formatPrice(booking.totalPrice) : (booking?.totalPrice ?? '-')}
                </div>
              </div>
              <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                <div className="text-slate-600 dark:text-slate-400">{t('booking.confirmation.requests')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {booking?.specialRequests || '-'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/rooms')}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {t('booking.success.actions.explore')}
              </button>
              <button
                type="button"
                onClick={goHome}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t('booking.success.actions.home')}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
