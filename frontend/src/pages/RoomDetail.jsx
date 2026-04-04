import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRoomDetail } from '../hooks/useRoomDetail';
import { ImageGallery, AvailabilityCalendar } from '../components/molecules';
import { Header, Footer } from '../components/organisms';
import LoadingState from '../components/atoms/LoadingState';
import ErrorState from '../components/atoms/ErrorState';
import RoomInfo from '../components/molecules/RoomInfo';
import HotelLocationInfo from '../components/molecules/HotelLocationInfo';
import RoomAmenities from '../components/molecules/RoomAmenities';
import RoomFeatures from '../components/molecules/RoomFeatures';
import { useAuth } from '../contexts/AuthContext';
import { favoriteService } from '../services/favoriteService';
import { roomService } from '../services/roomService';
import useToast from '../hooks/useToast';
import { formatPrice } from '../utils/roomUtils';

const RoomDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { room, loading, error, handleBackClick } = useRoomDetail(id);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useToast();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [reviewSummary, setReviewSummary] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavoriteIds([]);
        return;
      }
      try {
        const ids = await favoriteService.getFavorites();
        if (Array.isArray(ids)) setFavoriteIds(ids);
      } catch (_) {}
    };
    loadFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    let alive = true;
    const loadReviews = async () => {
      setReviewsLoading(true);
      setReviewsError('');
      try {
        const data = await roomService.getRoomReviews(id);
        if (!alive) return;
        setReviewSummary(data);
      } catch (_) {
        if (!alive) return;
        setReviewsError(t('reviews.loadError'));
      } finally {
        if (alive) setReviewsLoading(false);
      }
    };
    loadReviews();
    return () => { alive = false; };
  }, [id, t]);

  useEffect(() => {
    let alive = true;
    const loadEligibility = async () => {
      if (!isAuthenticated) {
        setCanReview(false);
        return;
      }
      try {
        const resp = await roomService.canCurrentUserReviewRoom(id);
        if (!alive) return;
        setCanReview(!!resp?.canReview);
      } catch (_) {
        if (!alive) return;
        setCanReview(false);
      }
    };
    loadEligibility();
    return () => { alive = false; };
  }, [id, isAuthenticated]);

  const isFavorite = useMemo(() => {
    if (!room) return false;
    return favoriteIds.includes(room.id);
  }, [favoriteIds, room]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification('info', t('favorites.loginToFavorite'));
      return;
    }
    if (!room) return;
    try {
      if (isFavorite) {
        setFavoriteIds(prev => prev.filter(id => id !== room.id));
        await favoriteService.removeFavorite(room.id);
      } else {
        setFavoriteIds(prev => [...prev, room.id]);
        await favoriteService.addFavorite(room.id);
      }
    } catch (_) {
      setFavoriteIds(prev => {
        const has = prev.includes(room.id);
        return has ? prev.filter(id => id !== room.id) : [...prev, room.id];
      });
    }
  };
  
  const openShareModal = () => {
    if (!room) return;
    const defaultText = room.description
      ? room.description
      : `${room.hotelName || ''}${room.city ? ` - ${room.city}` : ''}${room.country ? `, ${room.country}` : ''}`.trim();
    setShareMessage(defaultText);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const copyToClipboard = async (value) => {
    const text = String(value || '');
    if (!text) return false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch (_) {
      return false;
    }
  };

  const handleShareTo = async (network) => {
    const url = getShareUrl();
    const text = shareMessage || '';

    if (!url) return;

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    let target = '';
    if (network === 'facebook') {
      target = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    } else if (network === 'twitter') {
      target = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    } else if (network === 'instagram') {
      target = 'https://www.instagram.com/';
    }

    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }

    if (network === 'instagram') {
      const ok = await copyToClipboard(`${text}\n${url}`.trim());
      if (ok) {
        showNotification('success', t('share.copied'));
      }
    }
  };
  
  const handleDateChange = ({ startDate, endDate }) => {
    setSelectedDates({ startDate, endDate });
  };

  const handleBookingClick = () => {
    const checkIn = selectedDates?.startDate ? selectedDates.startDate.toISOString().split('T')[0] : undefined;
    const checkOut = selectedDates?.endDate ? selectedDates.endDate.toISOString().split('T')[0] : undefined;

    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(location?.pathname || `/room/${id}`);
      const params = new URLSearchParams();
      params.set('returnTo', returnTo);
      if (checkIn) params.set('checkIn', checkIn);
      if (checkOut) params.set('checkOut', checkOut);
      navigate(`/login?${params.toString()}`);
      return;
    }

    showNotification('info', t('booking.comingSoon'));
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onBack={handleBackClick} />;
  }

  if (!room) {
    return <ErrorState error={t('roomNotFound')} onBack={handleBackClick} />;
  }

  const averageRating = reviewSummary?.averageRating ?? room?.averageRating;
  const totalRatings = reviewSummary?.totalRatings ?? room?.totalRatings;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(location?.pathname || `/room/${id}`);
      const params = new URLSearchParams();
      params.set('returnTo', returnTo);
      navigate(`/login?${params.toString()}`);
      return;
    }
    if (!reviewRating) {
      showNotification('info', t('reviews.selectRating'));
      return;
    }
    try {
      setReviewSubmitting(true);
      const updated = await roomService.createOrUpdateRoomReview({
        roomId: room.id,
        rating: reviewRating,
        comment: reviewComment || null
      });
      setReviewSummary(updated);
      setReviewsError('');
      showNotification('success', t('reviews.saved'));
    } catch (e) {
      let serverMessage = '';
      try {
        const parsed = JSON.parse(e?.message || '');
        serverMessage = parsed?.message || '';
      } catch (_) {}
      setReviewsError(serverMessage || t('reviews.saveError'));
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Header />
      
      <div className="pt-16 pb-8 flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t('common.back')}</span>
            </button>
            
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {room.hotelName || `${t('common.room')} ${room.roomNumber}`}
              </h1>
              {(room?.category?.name || room?.categoryName) && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
                  {(room?.category?.name ?? room?.categoryName)}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
              {averageRating && (
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <span>{Number(averageRating).toFixed(1)} ({totalRatings ?? 0})</span>
                </span>
              )}
              {room.hotelRating && (
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <span>{room.hotelRating} / 5</span>
                </span>
              )}
              {(room.city || room.country) && (
                <span>
                  {room.city}{room.city && room.country ? ', ' : ''}{room.country}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 relative">
              <ImageGallery images={room.images} alt={`${t('common.room')} ${room.roomNumber}`} />
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('common.roomDetails')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      room.isAvailable
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {room.isAvailable ? t('common.available') : t('common.notAvailable')}
                    </span>
                    <button
                      type="button"
                      onClick={openShareModal}
                      aria-label={t('share.button')}
                      title={t('share.button')}
                      className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full p-2 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <circle cx="18" cy="5" r="2" />
                        <circle cx="6" cy="12" r="2" />
                        <circle cx="18" cy="19" r="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l8-5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l8 5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={toggleFavorite}
                      aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
                      title={!isAuthenticated ? t('favorites.loginToFavorite') : (isFavorite ? t('favorites.remove') : t('favorites.add'))}
                      className="bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full p-2 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.878 0-3.5 1.09-4.312 2.667C11.188 4.84 9.566 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 5.25 9 11.25 9 11.25s9-6 9-11.25z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
                      {room.description && (
                        <section className="pt-0">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                            {t('common.description')}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                            {room.description}
                          </p>
                        </section>
                      )}

                      <section className="pt-8">
                        <RoomInfo room={room} />
                      </section>

                      <section className="pt-8">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                          {t('room.sections.whatOffers')}
                        </h3>
                        <RoomFeatures features={room.features} showTitle={false} />
                        <RoomAmenities room={room} />
                      </section>

                      <section className="pt-8">
                        <HotelLocationInfo room={room} />
                      </section>

                      <section className="pt-8 w-full">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 underline decoration-2 underline-offset-8">
                          {t('reviews.title')}
                        </h3>

                        {reviewsError && (
                          <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded">
                            {reviewsError}
                          </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <div className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {averageRating ? Number(averageRating).toFixed(1) : '0.0'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {t('reviews.count', { count: totalRatings ?? 0 })}
                          </span>
                        </div>

                        {isAuthenticated && (
                          <div className="mb-6">
                            {canReview ? (
                              <form onSubmit={submitReview} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('reviews.yourRating')}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                      <button
                                        key={n}
                                        type="button"
                                        onClick={() => setReviewRating(n)}
                                        className="p-1"
                                        aria-label={`${n}`}
                                      >
                                        <svg className={`w-6 h-6 ${reviewRating >= n ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('reviews.comment')}
                                  </label>
                                  <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    rows="4"
                                    className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    placeholder={t('reviews.commentPlaceholder')}
                                  />
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    type="submit"
                                    disabled={reviewSubmitting}
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                                  >
                                    {reviewSubmitting ? t('reviews.saving') : t('reviews.submit')}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200">
                                {t('reviews.onlyAfterStay')}
                              </div>
                            )}
                          </div>
                        )}

                        {reviewsLoading ? (
                          <div className="text-sm text-gray-600 dark:text-gray-300">{t('reviews.loading')}</div>
                        ) : (
                          <div className="space-y-4">
                            {(reviewSummary?.reviews || []).length === 0 ? (
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t('reviews.empty')}
                              </div>
                            ) : (
                              (reviewSummary?.reviews || []).map((r) => (
                                <div key={r.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                  <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                          <svg key={n} className={`w-4 h-4 ${r.rating >= n ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                        ))}
                                      </div>
                                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{r.userName || t('reviews.anonymous')}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                                    </div>
                                  </div>
                                  {r.comment && (
                                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                      {r.comment}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </section>

                      <section className="pt-8 w-full">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 underline decoration-2 underline-offset-8">
                          {t('room.policies.title')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {t('room.policies.houseRules.title')}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {t('room.policies.houseRules.description')}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {t('room.policies.healthSafety.title')}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {t('room.policies.healthSafety.description')}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {t('room.policies.cancellation.title')}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {t('room.policies.cancellation.description')}
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 md:sticky md:top-24 space-y-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(room.pricePerNight)}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">{t('room.perNight')}</div>
                        </div>
                        {room.hotelRating && (
                          <div className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">
                            <svg className="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <span>{room.hotelRating}</span>
                          </div>
                        )}
                      </div>

                      <AvailabilityCalendar 
                        roomId={room.id} 
                        onDateChange={handleDateChange}
                        showBookingButton={room.isAvailable}
                      />

                      {room.isAvailable && (
                        <button
                          type="button"
                          onClick={handleBookingClick}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 11h14M7 15h10"/></svg>
                          {t('common.bookNow')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) closeShareModal(); }}>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg border border-gray-200 dark:border-gray-700 mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('share.title')}
              </h2>
              <button onClick={closeShareModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex gap-4">
                <div className="w-28 h-20 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {room?.images?.[0] ? (
                    <img src={room.images[0]} alt={room.hotelName || room.roomNumber} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {room.hotelName || `${t('common.room')} ${room.roomNumber}`}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {room.description || `${room.city || ''}${room.city && room.country ? ', ' : ''}${room.country || ''}`.trim()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('share.link')}</label>
                <input
                  readOnly
                  value={getShareUrl()}
                  className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('share.message')}</label>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => handleShareTo('facebook')}
                    aria-label={t('share.tooltips.facebook')}
                    className="h-11 w-11 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#1877F2] hover:bg-gray-50 dark:hover:bg-gray-700 inline-flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                      <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.6-1.6h1.5V4.8c-.7-.1-1.6-.2-2.6-.2-2.6 0-4.3 1.6-4.3 4.5V11H7v3h2.7v8h3.8z" />
                    </svg>
                  </button>
                  <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('share.tooltips.facebook')}
                  </span>
                </div>

                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => handleShareTo('twitter')}
                    aria-label={t('share.tooltips.twitter')}
                    className="h-11 w-11 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#1DA1F2] hover:bg-gray-50 dark:hover:bg-gray-700 inline-flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                      <path d="M19.7 7.2c.01.17.01.34.01.51 0 5.24-4.06 11.28-11.48 11.28-2.28 0-4.4-.66-6.18-1.79.32.04.63.05.96.05 1.89 0 3.63-.63 5.02-1.7-1.77-.03-3.26-1.18-3.77-2.76.25.04.49.07.76.07.36 0 .72-.05 1.06-.14-1.85-.36-3.24-1.97-3.24-3.89v-.05c.54.3 1.17.48 1.84.5-1.09-.71-1.81-1.9-1.81-3.26 0-.72.2-1.39.54-1.97 2 2.4 4.98 3.98 8.34 4.15-.07-.29-.11-.58-.11-.89 0-2.17 1.79-3.93 4-3.93 1.15 0 2.19.47 2.92 1.22.91-.17 1.77-.5 2.54-.95-.3.92-.93 1.69-1.76 2.18.81-.09 1.59-.3 2.31-.61-.54.79-1.22 1.49-2 2.05z" />
                    </svg>
                  </button>
                  <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('share.tooltips.twitter')}
                  </span>
                </div>

                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => handleShareTo('instagram')}
                    aria-label={t('share.tooltips.instagram')}
                    className="h-11 w-11 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#E1306C] hover:bg-gray-50 dark:hover:bg-gray-700 inline-flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5h.01" />
                    </svg>
                  </button>
                  <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('share.tooltips.instagram')}
                  </span>
                </div>

                <div className="relative group">
                  <button
                    type="button"
                    onClick={async () => {
                      const url = getShareUrl();
                      const ok = await copyToClipboard(url);
                      if (ok) {
                        showNotification('success', t('share.linkCopied'));
                      }
                    }}
                    aria-label={t('share.tooltips.copyLink')}
                    className="h-11 w-11 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 inline-flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
                    </svg>
                  </button>
                  <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('share.tooltips.copyLink')}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('share.instagramHint')}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button type="button" onClick={closeShareModal} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
