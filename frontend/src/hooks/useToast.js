import { useState, useRef, useCallback } from 'react';

// Unified toast notification hook for consistent usage across pages.
export const useToast = (defaultDuration = 2500) => {
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const timeoutRef = useRef(null);

  const hideNotification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  const showNotification = useCallback((type, message, duration = defaultDuration) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification({ show: true, type, message });
    if (duration && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
        timeoutRef.current = null;
      }, duration);
    }
  }, [defaultDuration]);

  return { notification, showNotification, hideNotification };
};

export default useToast;

