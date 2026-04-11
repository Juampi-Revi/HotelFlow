import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Footer } from '../../components/organisms';
import AvailabilityCalendar from '../../components/molecules/AvailabilityCalendar/AvailabilityCalendar';
import LoadingState from '../../components/atoms/LoadingState';
import ErrorState from '../../components/atoms/ErrorState';
import Toast from '../../components/atoms/Toast/Toast';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../contexts';
import { useToast } from '../../hooks';
import { formatDateYMD, formatPrice } from '../../utils/roomUtils';

const parseISODateToDate = (value) => {
  if (!value) return null;
  const str = String(value);
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const yyyy = Number(match[1]);
    const mm = Number(match[2]);
    const dd = Number(match[3]);
    const d = new Date(yyyy, mm - 1, dd);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
};

const decodeReturnTo = (value) => {
  if (!value) return null;
  let current = value;
  for (let i = 0; i < 2; i += 1) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch (_) {
      break;
    }
  }
  return current;
};

const BookingPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { notification, showNotification, hideNotification } = useToast();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialCheckIn = searchParams.get('checkIn');
  const initialCheckOut = searchParams.get('checkOut');

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState(parseISODateToDate(initialCheckIn));
  const [endDate, setEndDate] = useState(parseISODateToDate(initialCheckOut));
  const [rangeAvailable, setRangeAvailable] = useState(null);
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await roomService.getRoomById(roomId);
        setRoom(data);
        setGuests((prev) => {
          const cap = Number(data?.capacity || 1);
          if (!Number.isFinite(cap) || cap < 1) return prev;
          return Math.min(prev, cap);
        });
      } catch (e) {
        setError(e?.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId, t]);

  const nights = useMemo(() => {
    if (!(startDate && endDate)) return 0;
    const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const total = useMemo(() => {
    if (!room?.pricePerNight || nights <= 0) return null;
    const price = Number(room.pricePerNight);
    if (!Number.isFinite(price)) return null;
    return price * nights;
  }, [room?.pricePerNight, nights]);

  const selectedDatesText = useMemo(() => {
    if (!(startDate && endDate)) return t('booking.form.dates.empty');
    const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
    const fmt = (d) => d.toLocaleDateString(locale);
    return t('booking.form.dates.value', { start: fmt(startDate), end: fmt(endDate) });
  }, [endDate, i18n.language, startDate, t]);

  const canSubmit = !!room && !!startDate && !!endDate && rangeAvailable === true && guests >= 1 && !submitting;

  const handleCalendarChange = useCallback(({ startDate: nextStart, endDate: nextEnd }) => {
    setStartDate(nextStart || null);
    setEndDate(nextEnd || null);
    setSubmitError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!(room && startDate && endDate)) {
      setSubmitError(t('booking.errors.missingDates'));
      return;
    }

    if (rangeAvailable !== true) {
      setSubmitError(t('booking.errors.notAvailable'));
      return;
    }

    try {
      setSubmitting(true);
      const created = await bookingService.createBooking({
        roomId: room.id,
        checkInDate: formatDateYMD(startDate),
        checkOutDate: formatDateYMD(endDate),
        numberOfGuests: guests,
        specialRequests: specialRequests || null
      });
      if (created?.notificationEmailSent === false) {
        showNotification('warning', t('booking.success.emailWarning'));
      } else {
        showNotification('success', t('booking.success.toast'));
      }
      navigate(`/booking/confirmation/${created.id}`);
    } catch (err) {
      const status = err?.status;
      let message = typeof err?.message === 'string' ? err.message : '';
      try {
        const parsed = JSON.parse(message || '');
        message = parsed?.message || parsed?.error || message;
      } catch (_) {}
      const isNetworkError = !status && typeof message === 'string' && (message.includes('Failed to fetch') || message.includes('NetworkError'));
      if (status === 409) {
        setSubmitError(message || t('booking.errors.notAvailable'));
      } else if (status === 400) {
        setSubmitError(message || t('booking.errors.invalid'));
      } else if (status === 401) {
        setSubmitError(t('booking.errors.unauthorized'));
      } else if (isNetworkError) {
        setSubmitError(t('booking.errors.network'));
      } else {
        setSubmitError(message || t('booking.errors.generic'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goBackToRoom = () => {
    navigate(`/room/${roomId}`);
  };

  const handleLoginAgain = () => {
    const params = new URLSearchParams();
    const returnTo = decodeReturnTo(`/booking/${roomId}${location.search || ''}`);
    params.set('returnTo', returnTo);
    navigate(`/login?${params.toString()}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onBack={goBackToRoom} />;
  }

  if (!room) {
    return <ErrorState error={t('common.roomNotFound')} onBack={goBackToRoom} />;
  }

  const maxGuests = Number(room.capacity || 10);
  const safeMaxGuests = Number.isFinite(maxGuests) && maxGuests > 0 ? maxGuests : 10;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <button
              type="button"
              onClick={goBackToRoom}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t('common.back')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t('booking.title')}
                </h1>
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {t('booking.product', { name: room.hotelName || `${t('common.room')} ${room.roomNumber}` })}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                    {room?.images?.[0] ? (
                      <img src={room.images[0]} alt={room.hotelName || room.roomNumber} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 grid place-items-center text-sm text-gray-600 dark:text-gray-300">
                        {t('common.noImages')}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">{t('common.location')}:</span>{' '}
                      {room.city}{room.city && room.country ? ', ' : ''}{room.country}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">{t('common.pricePerNight')}:</span>{' '}
                      {formatPrice(room.pricePerNight)}
                    </div>
                    {room.capacity && (
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{t('common.capacity')}:</span>{' '}
                        {room.capacity} {t(room.capacity === 1 ? 'common.guest' : 'common.guests')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('booking.sections.dates')}
                </h2>
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {selectedDatesText}
                </div>
                <div className="mt-4">
                  <AvailabilityCalendar
                    roomId={room.id}
                    onDateChange={handleCalendarChange}
                    onAvailabilityChange={setRangeAvailable}
                    initialStartDate={startDate}
                    initialEndDate={endDate}
                    showBookingButton={false}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('booking.sections.user')}
                </h2>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white">
                    {user?.firstName || '-'}
                  </div>
                  <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white">
                    {user?.lastName || '-'}
                  </div>
                  <div className="rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white">
                    {user?.email || '-'}
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  {t('booking.userHint')}
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleLoginAgain}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {t('booking.userChange')}
                  </button>
                </div>
              </div>
            </section>

            <aside className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('booking.sections.summary')}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {t('booking.form.guests')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={safeMaxGuests}
                      value={guests}
                      onChange={(e) => setGuests(Math.max(1, Math.min(safeMaxGuests, Number(e.target.value || 1))))}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      disabled={submitting}
                    />
                    {room.capacity && (
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {t('booking.form.maxGuests', { count: room.capacity })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {t('booking.form.specialRequests')}
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      placeholder={t('booking.form.specialRequestsPlaceholder')}
                      disabled={submitting}
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3">
                    <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                      <span>{t('booking.form.nights')}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{nights || '-'}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                      <span>{t('booking.form.total')}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{total != null ? formatPrice(total) : '-'}</span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  >
                    {submitting ? t('booking.actions.submitting') : t('booking.actions.confirm')}
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      {notification.show && (
        <Toast
          message={notification.message}
          type={notification.type}
          isVisible={notification.show}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default BookingPage;
