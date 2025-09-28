import React from 'react';

const ThumbnailColumn = ({ 
  images, 
  alt, 
  selectedImageIndex, 
  onImageClick, 
  onViewMore 
}) => {
  return (
    <div className="w-24 flex flex-col gap-2">
      {images.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 ${
            selectedImageIndex === index 
              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' 
              : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-gray-900'
          }`}
          onClick={() => onImageClick(index)}
        >
          <img
            src={image}
            alt={`${alt} - ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {selectedImageIndex !== index && (
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-200" />
          )}
        </div>
      ))}
      
      {images.length > 4 && (
        <div
          className="aspect-square rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer group transition-all duration-200 hover:bg-black/70"
          onClick={onViewMore}
        >
          <div className="text-center text-white">
            <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div className="text-xs font-semibold">+{images.length - 4}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailColumn;