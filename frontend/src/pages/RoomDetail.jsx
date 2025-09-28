import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomService } from '../services/roomService';
import { ImageGallery } from '../components/molecules';
import { Header, Footer } from '../components/organisms';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const roomData = await roomService.getRoomById(id);
        setRoom(roomData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{t('error')}: {error}</p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {t('goBack')}
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('roomNotFound')}</p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {t('goBack')}
          </button>
        </div>
      </div>
    );
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

                {/* Room Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="text-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">{t('common.roomType')}</span>
                      <div className="font-bold text-gray-900 dark:text-white text-lg mt-1">{room.roomType}</div>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="text-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">{t('common.capacity')}</span>
                      <div className="font-bold text-gray-900 dark:text-white text-lg mt-1">
                        {room.capacity} {room.capacity === 1 ? t('common.guest') : t('common.guests')}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="text-center">
                      <span className="text-gray-700 dark:text-gray-200 font-semibold text-sm">{t('common.pricePerNight')}</span>
                      <div className="font-bold text-2xl text-blue-600 dark:text-blue-400 mt-1">
                        {formatPrice(room.pricePerNight)}
                      </div>
                    </div>
                  </div>
                </div>

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

                {/* Booking Section */}
                {room.isAvailable && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-2">
                        {t('common.bookNow')}
                      </h3>
                      <p className="text-blue-100 mb-4 text-sm">
                        {t('common.reserve')} {t('common.room')} {room.roomNumber}
                      </p>
                      <button
                        onClick={() => {
                          // TODO: Implementar lógica de reserva
                          alert(`Reservando ${t('common.room')} ${room.roomNumber}`);
                        }}
                        className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
                      >
                        {t('common.reserve')} - {formatPrice(room.pricePerNight)}
                      </button>
                    </div>
                  </div>
                )}
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