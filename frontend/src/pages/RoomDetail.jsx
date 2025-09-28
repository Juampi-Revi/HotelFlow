import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomService } from '../services/roomService';
import Header from '../components/organisms/Header';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="pt-20 pb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8">
                {room.images && room.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden">
                      <img
                        src={room.images[selectedImageIndex]}
                        alt={`${t('common.room')} ${room.roomNumber}`}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                    {room.images.length > 1 && (
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {room.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                              selectedImageIndex === index
                                ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${t('common.room')} ${room.roomNumber} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
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

                  <div className="space-y-4">
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{t('common.roomType')}:</span>
                        <span className="font-bold text-gray-900 dark:text-white text-lg">{room.roomType}</span>
                      </div>
                    </div>

                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{t('common.capacity')}:</span>
                        <span className="font-bold text-gray-900 dark:text-white text-lg">
                          {room.capacity} {room.capacity === 1 ? t('common.guest') : t('common.guests')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-200 font-semibold text-lg">{t('common.pricePerNight')}:</span>
                        <span className="font-bold text-3xl text-blue-600 dark:text-blue-400">
                          {formatPrice(room.pricePerNight)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {room.description && (
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        {t('common.description')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {room.description}
                      </p>
                    </div>
                  )}

                  {room.isAvailable && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">
                          {t('common.bookNow')}
                        </h3>
                        <p className="text-blue-100 mb-4">
                          {t('common.reserve')} {t('common.room')} {room.roomNumber}
                        </p>
                        <button
                          onClick={() => {
                            // TODO: Implementar lógica de reserva
                            alert(`Reservando ${t('common.room')} ${room.roomNumber}`);
                          }}
                          className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
      </div>
    </div>
  );
};

export default RoomDetail;