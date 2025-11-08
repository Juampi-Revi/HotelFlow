import React from 'react';
import { useParams } from 'react-router-dom';
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

const RoomDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { room, loading, error, handleBackClick, handleBooking } = useRoomDetail(id);
  
  const handleDateChange = ({ startDate, endDate }) => {
    // Handle date selection for potential booking
    console.log('Selected dates:', { startDate, endDate });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Header />
      
      <div className="pt-16 pb-6 flex-grow">
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
                {t('common.room')} {room.roomNumber}
              </h1>
              {(room?.category?.name || room?.categoryName) && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
                  {(room?.category?.name ?? room?.categoryName)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            {/* Image Gallery - Full Width */}
            <div className="p-4">
              <ImageGallery images={room.images} alt={`${t('common.room')} ${room.roomNumber}`} />
            </div>
            
            {/* Room Details - Compact Grid */}
            <div className="p-4 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('common.roomDetails')}
                  </h2>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    room.isAvailable
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {room.isAvailable ? t('common.available') : t('common.notAvailable')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Info */}
                  <div className="md:col-span-2 space-y-4">
                    <RoomInfo room={room} />

                    {/* Move offerings up to prioritize value */}
                    <RoomFeatures features={room.features} />

                    <RoomAmenities room={room} />

                    {/* Location and hotel info later */}
                    <HotelLocationInfo room={room} />

                    {/* Description */}
                    {room.description && (
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                          {t('common.description')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                          {room.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Availability Calendar */}
                  <div className="md:col-span-1">
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border border-gray-200/60 dark:border-gray-700/60 md:sticky md:top-24">
                      <AvailabilityCalendar 
                        roomId={room.id} 
                        onDateChange={handleDateChange}
                        showBookingButton={room.isAvailable}
                      />
                    </div>
                  </div>
                </div>
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