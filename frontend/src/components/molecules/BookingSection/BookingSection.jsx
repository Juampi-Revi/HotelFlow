import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../utils/roomUtils';

const BookingSection = ({ room, onBooking }) => {
  const { t } = useTranslation();

  if (!room.isAvailable) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">
          {t('common.bookNow')}
        </h3>
        <p className="text-blue-100 mb-4 text-sm">
          {t('common.reserve')} {t('common.room')} {room.roomNumber}
        </p>
        <button
          onClick={() => onBooking(room.roomNumber)}
          className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
        >
          {t('common.reserve')} - {formatPrice(room.pricePerNight)}
        </button>
      </div>
    </div>
  );
};

export default BookingSection;