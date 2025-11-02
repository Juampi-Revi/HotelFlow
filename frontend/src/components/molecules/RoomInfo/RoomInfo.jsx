import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../utils/roomUtils';

const RoomInfo = ({ room }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
    </div>
  );
};

export default RoomInfo;