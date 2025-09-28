import React from 'react';

const MainImage = ({ src, alt, className = "" }) => {
  return (
    <div className={`relative h-full rounded-2xl overflow-hidden group cursor-pointer ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default MainImage;