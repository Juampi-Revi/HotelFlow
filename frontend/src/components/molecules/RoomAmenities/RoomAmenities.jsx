import React from 'react';
import { useTranslation } from 'react-i18next';

const normalize = (text = '') => text.toLowerCase().trim();
const isWifi = (text) => {
  const n = normalize(text);
  return n.includes('wifi') || n.includes('wi-fi');
};
const isAirConditioning = (text) => {
  const n = normalize(text);
  return n.includes('air') && n.includes('condition');
};
const isBalcony = (text) => normalize(text).includes('balcony');

const amenityTranslations = {
  'minibar': 'Minibar',
  'safe': 'Caja fuerte',
  'flat screen tv': 'TV de pantalla plana',
  'living area': 'Sala de estar',
  'jacuzzi': 'Jacuzzi',
  'marble bathroom': 'Baño de mármol',
  'terrace': 'Terraza',
  'connecting rooms': 'Habitaciones conectadas',
  'beach access': 'Acceso a la playa',
  'ocean view': 'Vista al océano',
  'kitchenette': 'Kitchenette',
  'premium amenities': 'Amenidades premium',
  'palace view': 'Vista al palacio',
  'park view': 'Vista al parque',
  'garden view': 'Vista al jardín',
  'city view': 'Vista a la ciudad',
  'mountain view': 'Vista a la montaña',
  'river view': 'Vista al río',
  'lake view': 'Vista al lago',
  'harbor view': 'Vista al puerto',
  'bridge view': 'Vista al puente'
};

const translateAmenity = (amenity) => {
  const t = amenityTranslations[normalize(amenity)];
  return t || amenity;
};

const RoomAmenities = ({ room }) => {
  const { t } = useTranslation();

  const includedFlags = {
    wifi: !!room.hasWifi,
    ac: !!room.hasAirConditioning,
    balcony: !!room.hasBalcony
  };

  const filteredAmenities = (room.amenities || []).filter((amenity) => {
    // Excluir duplicados que ya se muestran en "Incluido"
    if (includedFlags.wifi && isWifi(amenity)) return false;
    if (includedFlags.ac && isAirConditioning(amenity)) return false;
    if (includedFlags.balcony && isBalcony(amenity)) return false;
    return true;
  });

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-5 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('common.included')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Amenities */}
        <div>
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
        {filteredAmenities.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('common.additional')}</h4>
            <div className="flex flex-wrap gap-2">
              {filteredAmenities.map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                  {translateAmenity(amenity)}
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