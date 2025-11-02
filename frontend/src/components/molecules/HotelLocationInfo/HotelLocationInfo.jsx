import React from 'react';
import { useTranslation } from 'react-i18next';

const HotelLocationInfo = ({ room }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('common.location')}</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">{t('common.location')}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{room.city}, {room.country}</span>
          </div>
          {room.address && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t('common.address')}:</span>
              <span className="font-medium text-gray-900 dark:text-white text-right">{room.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('room.sections.keyDetails', 'Detalles clave')}</h4>
        <div className="space-y-2">
          {room.sizeSqm && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t('common.size')}:</span>
              <span className="font-medium text-gray-900 dark:text-white">{room.sizeSqm} m²</span>
            </div>
          )}
          {room.floor && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t('common.floor')}:</span>
              <span className="font-medium text-gray-900 dark:text-white">{room.floor}</span>
            </div>
          )}
          {room.viewType && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t('common.view')}:</span>
              <span className="font-medium text-gray-900 dark:text-white">{room.viewType} {t('common.viewType')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelLocationInfo;