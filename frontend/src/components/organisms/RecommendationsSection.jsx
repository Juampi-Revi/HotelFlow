import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { roomService } from '../../services/roomService';
import RoomGrid from './RoomGrid';

export const RecommendationsSection = ({ favoriteIds = [], onToggleFavorite }) => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
        }
        const data = await roomService.getRoomsForHome();
        const list = Array.isArray(data) ? data : [];
        const withImages = list.filter((r) => Array.isArray(r?.images) && r.images.length > 0);
        const sorted = [...withImages].sort((a, b) => {
          const aCount = Array.isArray(a?.images) ? a.images.length : 0;
          const bCount = Array.isArray(b?.images) ? b.images.length : 0;
          return bCount - aCount;
        });
        const uniqueByHotel = [];
        const seen = new Set();
        for (const room of sorted) {
          const key = String(room?.hotelName || '').trim().toLowerCase();
          if (!key) continue;
          if (seen.has(key)) continue;
          seen.add(key);
          uniqueByHotel.push(room);
          if (uniqueByHotel.length >= 3) break;
        }
        if (isMounted) {
          setRooms(uniqueByHotel.length > 0 ? uniqueByHotel : sorted.slice(0, 3));
        }
      } catch (e) {
        if (isMounted) {
          setRooms([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <RoomGrid
      rooms={rooms}
      title={t('recommendations.title')}
      isLoading={isLoading}
      favoriteIds={favoriteIds}
      onToggleFavorite={onToggleFavorite}
    />
  );
};
