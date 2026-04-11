import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import LoadingState from '../../atoms/LoadingState';
import { roomService } from '../../../services/roomService';
import { useAuth } from '../../../contexts';
import { Link, useLocation } from 'react-router-dom';
import { formatDateYMD } from '../../../utils/roomUtils';

const AvailabilityCalendar = ({ 
  roomId,
  onDateChange,
  onAvailabilityChange,
  initialStartDate = null,
  initialEndDate = null,
  className = '',
  showBookingButton = true,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);

  // Fetch occupied dates when component mounts or roomId changes
  useEffect(() => {
    if (roomId) {
      fetchOccupiedDates();
    }
  }, [roomId]);

  // Check availability when dates change
  useEffect(() => {
    if (startDate && endDate && roomId) {
      checkAvailability();
    } else {
      setIsAvailable(null);
    }
  }, [startDate, endDate, roomId]);

  useEffect(() => {
    if (typeof onAvailabilityChange === 'function') {
      onAvailabilityChange(isAvailable);
    }
  }, [isAvailable, onAvailabilityChange]);

  useEffect(() => {
    if (initialStartDate) {
      setStartDate(initialStartDate);
    }
    if (initialEndDate) {
      setEndDate(initialEndDate);
    }
    if (onDateChange) {
      onDateChange({ startDate: initialStartDate, endDate: initialEndDate });
    }
  }, [initialStartDate, initialEndDate, onDateChange]);

  const fetchOccupiedDates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const endOfYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      
      const data = await roomService.getOccupiedDates(
        roomId,
        formatDateYMD(today),
        formatDateYMD(endOfYear)
      );
      
      // Convert date strings to Date objects for react-datepicker
      const occupiedDateObjects = [];
      const ranges = Array.isArray(data?.occupiedRanges) ? data.occupiedRanges : [];
      ranges.forEach(range => {
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          occupiedDateObjects.push(new Date(d));
        }
      });
      
      setOccupiedDates(occupiedDateObjects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!startDate || !endDate || !roomId) return;
    
    try {
      const checkIn = formatDateYMD(startDate);
      const checkOut = formatDateYMD(endDate);
      
      const data = await roomService.checkRoomAvailability(roomId, checkIn, checkOut);
      setIsAvailable(Boolean(data?.isAvailable));
    } catch (err) {
      setIsAvailable(false);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate && date >= endDate) {
      setEndDate(null);
    }
    if (onDateChange) {
      onDateChange({ startDate: date, endDate: endDate });
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (onDateChange) {
      onDateChange({ startDate: startDate, endDate: date });
    }
  };

  const isDateOccupied = (date) => {
    return occupiedDates.some(occupiedDate => 
      occupiedDate.toDateString() === date.toDateString()
    );
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates and occupied dates
    return date < today || isDateOccupied(date);
  };

  const getDayClassName = (date) => {
    if (isDateOccupied(date)) {
      return 'occupied-date';
    }
    return '';
  };

  const today = new Date();

  // Custom popper container for proper z-index
  const popperContainer = ({ children }) => (
    <div style={{ zIndex: 2147483647 }}>
      {children}
    </div>
  );

  const checkIn = startDate ? formatDateYMD(startDate) : undefined;
  const checkOut = endDate ? formatDateYMD(endDate) : undefined;
  const bookingTo = checkIn && checkOut ? `/booking/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}` : `/booking/${roomId}`;
  const loginParams = new URLSearchParams();
  loginParams.set('returnTo', location?.pathname || `/room/${roomId}`);
  if (checkIn) loginParams.set('checkIn', checkIn);
  if (checkOut) loginParams.set('checkOut', checkOut);
  const loginTo = `/login?${loginParams.toString()}`;
  const ctaTo = isAuthenticated ? bookingTo : loginTo;

  if (loading) {
    return (
      <div className={`availability-calendar ${className}`}>
        <LoadingState message={t('calendar.loading')} />
      </div>
    );
  }

  return (
    <div className={`availability-calendar ${className}`}>
      <style>{`
        .availability-calendar .occupied-date {
          background-color: #ef4444 !important;
          color: white !important;
          position: relative;
        }
        
        .availability-calendar .occupied-date:hover {
          background-color: #dc2626 !important;
        }
        
        .availability-calendar .occupied-date::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 2px;
          width: 4px;
          height: 4px;
          background-color: white;
          border-radius: 50%;
        }

        /* Subtle highlight for available dates (non-past, non-occupied) */
        .availability-calendar .available-date {
          background-color: #f0fdf4; /* emerald-50 */
          color: inherit;
        }
        .availability-calendar .available-date:hover {
          background-color: #dcfce7; /* emerald-100 */
        }
        
        .availability-calendar .react-datepicker {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .availability-calendar .react-datepicker__month-container {
          margin: 0.5rem;
        }
        
        .availability-calendar .react-datepicker__day--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        
        .availability-calendar .react-datepicker__day--in-selecting-range {
          background-color: #dbeafe !important;
          color: #1e40af !important;
        }
        
        .availability-calendar .react-datepicker__day--in-range {
          background-color: #bfdbfe !important;
          color: #1e40af !important;
        }
      `}</style>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('calendar.selectDates')}
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-between gap-3">
            <span>
              {t('calendar.error')}: {error}
            </span>
            <button
              type="button"
              onClick={fetchOccupiedDates}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-1.5 rounded-md text-sm"
            >
              {t('calendar.retry')}
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('calendar.checkIn')}
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={today}
              filterDate={(date) => !isDateDisabled(date)}
              dayClassName={(date) => {
                const cls = getDayClassName(date);
                if (cls) return cls;
                return date >= today ? 'available-date' : '';
              }}
              placeholderText={t('calendar.selectCheckIn')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              dateFormat="dd/MM/yyyy"
              withPortal
              portalId="datepicker-portal-root"
              popperProps={{ strategy: 'fixed' }}
              popperClassName="z-[2147483647]"
              calendarClassName="z-[2147483647]"
              wrapperClassName="relative z-[2147483647]"
              popperPlacement="bottom-start"
              popperContainer={popperContainer}
              monthsShown={2}
              showDisabledMonthNavigation
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('calendar.checkOut')}
            </label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || today}
              filterDate={(date) => !isDateDisabled(date)}
              dayClassName={(date) => {
                const cls = getDayClassName(date);
                if (cls) return cls;
                const min = startDate || today;
                return date >= min ? 'available-date' : '';
              }}
              placeholderText={t('calendar.selectCheckOut')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              dateFormat="dd/MM/yyyy"
              withPortal
              portalId="datepicker-portal-root"
              popperProps={{ strategy: 'fixed' }}
              popperClassName="z-[2147483647]"
              calendarClassName="z-[2147483647]"
              wrapperClassName="relative z-[2147483647]"
              popperPlacement="bottom-start"
              popperContainer={popperContainer}
              monthsShown={2}
              showDisabledMonthNavigation
            />
          </div>
        </div>
        
        {/* Availability Status */}
        {startDate && endDate && (
          <div className="mb-4">
            {isAvailable === true && (
              <div className="flex items-center p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('calendar.available')}
              </div>
            )}
            
            {isAvailable === false && (
              <div className="flex items-center p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {t('calendar.notAvailable')}
              </div>
            )}
          </div>
        )}
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            {t('calendar.occupied')}
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            {t('calendar.selected')}
          </div>
        </div>
        
        {/* Book Now / Login CTA */}
        {showBookingButton && startDate && endDate && isAvailable && (
          <Link
            to={ctaTo}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isAuthenticated ? t('calendar.bookNow') : t('auth.loginToBook')}
          </Link>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
