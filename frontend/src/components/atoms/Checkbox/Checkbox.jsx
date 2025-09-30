import React from 'react';

const Checkbox = ({ 
  label, 
  checked = false, 
  onChange, 
  disabled = false, 
  error = null,
  className = '',
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-4 h-4 rounded border-2 transition-all duration-200 focus:ring-2 focus:ring-offset-2
            ${disabled 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50' 
              : checked
                ? 'bg-blue-600 border-blue-600 text-white focus:ring-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-400 focus:ring-blue-500'
            }
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:checked:border-blue-600
          `}
          {...props}
        />
      </div>
      
      {label && (
        <div className="flex-1">
          <label className={`
            text-sm font-medium cursor-pointer
            ${disabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 dark:text-gray-300'
            }
            ${error ? 'text-red-600 dark:text-red-400' : ''}
          `}>
            {label}
          </label>
          
          {error && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;