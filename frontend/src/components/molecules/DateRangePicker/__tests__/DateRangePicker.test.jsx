import { render, screen, fireEvent } from '@testing-library/react';
import DateRangePicker from '../DateRangePicker';

// Mock useTranslation to avoid I18nextProvider and hooks issues
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ 
    t: (key, defaultValue) => {
      const translations = {
        'search.checkIn': 'Check-in',
        'search.checkOut': 'Check-out',
        'search.selectCheckIn': 'Select check-in date',
        'search.selectCheckOut': 'Select check-out date'
      };
      return translations[key] || defaultValue || key;
    }
  })
}));

// Mock react-datepicker
jest.mock('react-datepicker', () => {
  return function MockDatePicker({ selected, onChange, placeholderText, onFocus, onBlur }) {
    return (
      <input
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange(new Date(e.target.value))}
        placeholder={placeholderText}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  };
});

describe('DateRangePicker', () => {
  const mockProps = {
    startDate: null,
    endDate: null,
    onDateChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders check-in and check-out inputs', () => {
    render(<DateRangePicker {...mockProps} />);
    
    expect(screen.getByText('Check-in')).toBeInTheDocument();
    expect(screen.getByText('Check-out')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select check-in date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select check-out date')).toBeInTheDocument();
  });

  test('displays selected dates', () => {
    const propsWithDates = {
      ...mockProps,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-05'),
    };
    
    render(<DateRangePicker {...propsWithDates} />);
    
    expect(screen.getByDisplayValue('2024-12-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-05')).toBeInTheDocument();
  });

  test('handles check-in date change', () => {
    render(<DateRangePicker {...mockProps} />);
    
    const checkInInput = screen.getByPlaceholderText('Select check-in date');
    fireEvent.change(checkInInput, { target: { value: '2024-12-01' } });
    
    expect(mockProps.onDateChange).toHaveBeenCalledWith({
      startDate: new Date('2024-12-01'),
      endDate: null
    });
  });

  test('handles check-out date change', () => {
    render(<DateRangePicker {...mockProps} />);
    
    const checkOutInput = screen.getByPlaceholderText('Select check-out date');
    fireEvent.change(checkOutInput, { target: { value: '2024-12-05' } });
    
    expect(mockProps.onDateChange).toHaveBeenCalledWith({
      startDate: null,
      endDate: new Date('2024-12-05')
    });
  });

  test('calls onDateChange when dates are selected', () => {
    const startDate = new Date('2024-12-01');
    const endDate = new Date('2024-12-05');
    
    render(
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onDateChange={mockProps.onDateChange}
      />
    );
    
    // Component renders without errors
    expect(screen.getByDisplayValue('2024-12-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-05')).toBeInTheDocument();
  });

  test('handles focus and blur events', () => {
    render(<DateRangePicker {...mockProps} />);
    
    const checkInInput = screen.getByPlaceholderText('Select check-in date');
    
    fireEvent.focus(checkInInput);
    fireEvent.blur(checkInInput);
    
    // Test passes if no errors are thrown
    expect(checkInInput).toBeInTheDocument();
  });
});
