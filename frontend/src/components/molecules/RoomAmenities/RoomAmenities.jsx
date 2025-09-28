import React from 'react';
import { useTranslation } from 'react-i18next';

const RoomAmenities = ({ room }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-5 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('common.amenities')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Amenities */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('common.included')}</h4>
          <div className="flex flex-wrap gap-2">
            {room.hasWifi && (
              <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                WiFi
              </span>
            )}
            {room.hasAirConditioning && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                {t('common.airConditioning')}
              </span>
            )}
            {room.hasBalcony && (
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                {t('common.balcony')}
              </span>
            )}
          </div>
        </div>
        
        {/* Additional Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('common.additional')}</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomAmenities;