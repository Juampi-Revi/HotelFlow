import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRoomDetail } from '../hooks/useRoomDetail';
import { ImageGallery } from '../components/molecules';
import { Header, Footer } from '../components/organisms';
import LoadingState from '../components/atoms/LoadingState';
import ErrorState from '../components/atoms/ErrorState';
import RoomInfo from '../components/molecules/RoomInfo';
import HotelLocationInfo from '../components/molecules/HotelLocationInfo';
import RoomAmenities from '../components/molecules/RoomAmenities';
import BookingSection from '../components/molecules/BookingSection';

const RoomDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { room, loading, error, handleBackClick, handleBooking } = useRoomDetail(id);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onBack={handleBackClick} />;
  }

  if (!room) {
    return <ErrorState error={t('roomNotFound')} onBack={handleBackClick} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Header />
      
      <div className="pt-20 pb-8 flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t('common.back')}</span>
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('common.room')} {room.roomNumber}
            </h1>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            {/* Image Gallery - Full Width */}
            <div className="p-8">
              <ImageGallery images={room.images} alt={`${t('common.room')} ${room.roomNumber}`} />
            </div>
            
            {/* Room Details - Full Width */}
            <div className="p-6 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('common.roomDetails')}
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    room.isAvailable
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {room.isAvailable ? t('common.available') : t('common.notAvailable')}
                  </span>
                </div>

                <RoomInfo room={room} />

                <HotelLocationInfo room={room} />

                <RoomAmenities room={room} />

                {/* Description */}
                {room.description && (
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-5 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      {t('common.description')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {room.description}
                    </p>
                  </div>
                )}

                <BookingSection room={room} onBooking={handleBooking} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoomDetail;