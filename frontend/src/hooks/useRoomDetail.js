import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/roomService';

export const useRoomDetail = (roomId) => {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const roomData = await roomService.getRoomById(roomId);
        setRoom(roomData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleBooking = () => {
    alert(`Booking room ${roomNumber}`);
  };

  return {
    room,
    loading,
    error,
    handleBackClick,
    handleBooking
  };
};