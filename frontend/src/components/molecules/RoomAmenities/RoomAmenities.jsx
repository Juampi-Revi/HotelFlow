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
    <div className="p-0 m-0">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('common.included')}</h4>
          <div className="flex flex-wrap gap-2">
            {room.hasWifi && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M16.704 7.696a9 9 0 00-13.408 0l1.12 1.12a7.5 7.5 0 0111.168 0l1.12-1.12zM5.88 10.12a4.5 4.5 0 018.24 0l1.12-1.12a6 6 0 00-10.48 0l1.12 1.12zM7.75 12.25a2 2 0 012.5 0l-1.25 1.25-1.25-1.25z"/></svg>
                WiFi
              </span>
            )}
            {room.hasAirConditioning && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5 5l14 14M19 5L5 19"/></svg>
                {t('common.airConditioning')}
              </span>
            )}
            {room.hasBalcony && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M6 7h12M6 17h12"/></svg>
                {t('common.balcony')}
              </span>
            )}
          </div>
        </div>

        {filteredAmenities.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('common.additional')}</h4>
            <div className="flex flex-wrap gap-2">
              {filteredAmenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>
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
