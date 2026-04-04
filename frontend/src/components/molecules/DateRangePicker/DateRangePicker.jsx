import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onDateChange, 
  className = '',
  disabled = false,
  showLabels = true,
}) => {
  const { t } = useTranslation();

  const inputClasses = showLabels
    ? 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
    : 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white';
  const containerClasses = showLabels
    ? 'flex flex-col sm:flex-row gap-4'
    : 'flex flex-col sm:flex-row gap-3 items-center';

  const handleStartDateChange = (date) => {
    onDateChange({ startDate: date, endDate: endDate });
  };

  const handleEndDateChange = (date) => {
    onDateChange({ startDate: startDate, endDate: date });
  };

  const today = new Date();

  const popperContainer = ({ children }) => (
    <div style={{ zIndex: 2147483647 }}>
      {children}
    </div>
  );

  return (
    <div className={`${containerClasses} ${className}`}>
      <div>
        {showLabels && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('search.checkIn', 'Check-in')}
          </label>
        )}
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={today}
          placeholderText={showLabels ? t('search.checkInPlaceholder', 'Select check-in date') : t('search.checkIn', 'Check-in')}
          className={inputClasses}
          dateFormat="dd/MM/yyyy"
          disabled={disabled}
          monthsShown={2}
          withPortal
          portalId="datepicker-portal-root"
          popperProps={{ strategy: 'fixed' }}
          popperClassName="z-[2147483647]"
          calendarClassName="z-[2147483647]"
          wrapperClassName="relative z-[2147483647]"
          popperPlacement="bottom-start"
          popperContainer={popperContainer}
        />
      </div>
      
      <div className="flex-1">
        {showLabels && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('search.checkOut', 'Check-out')}
          </label>
        )}
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || today}
          placeholderText={showLabels ? t('search.checkOutPlaceholder', 'Select check-out date') : t('search.checkOut', 'Check-out')}
          className={inputClasses}
          dateFormat="dd/MM/yyyy"
          disabled={disabled}
          monthsShown={2}
          withPortal
          portalId="datepicker-portal-root"
          popperProps={{ strategy: 'fixed' }}
          popperClassName="z-[2147483647]"
          calendarClassName="z-[2147483647]"
          wrapperClassName="relative z-[2147483647]"
          popperPlacement="bottom-start"
          popperContainer={popperContainer}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
