import React from 'react';

const Logo = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`font-bold text-primary-500 ${sizeClasses[size]} ${className}`}>
      <span className="text-primary-500">Hotel</span>
      <span className="text-secondary-500">Flow</span>
    </div>
  );
};

export default Logo;