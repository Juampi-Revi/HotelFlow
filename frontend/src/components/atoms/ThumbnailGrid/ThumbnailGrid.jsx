import React from 'react';
import { useTranslation } from 'react-i18next';

const ThumbnailGrid = ({ 
  images, 
  alt, 
  onImageClick, 
  onViewMore, 
  hasMoreImages, 
  totalImages,
  layout = "desktop" // "desktop" or "mobile"
}) => {
  const { t } = useTranslation();
  
  const maxImages = layout === "desktop" ? 4 : 6;
  const displayImages = images.slice(0, maxImages);
  const remainingCount = totalImages - (layout === "desktop" ? 5 : 6);

  if (layout === "desktop") {
    return (
      <div className="grid grid-cols-2 gap-2 h-full">
        {Array.from({ length: 4 }).map((_, index) => {
          const image = displayImages[index];
          const actualIndex = index + 1;
          const isLastImage = index === 3;
          const showViewMore = isLastImage && hasMoreImages;
          
          return (
            <div
              key={actualIndex}
              className="relative rounded-md overflow-hidden cursor-pointer group"
              onClick={() => image && onImageClick(actualIndex)}
            >
              {image ? (
                <img
                  src={image}
                  alt={`${alt} - ${actualIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800" />
              )}
              
              {showViewMore && (
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMore();
                  }}
                >
                  <div className="text-center text-white">
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div className="text-sm font-semibold">{t('gallery.viewMore')}</div>
                    <div className="text-xs text-gray-200 mt-1">+{remainingCount}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Mobile layout
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {displayImages.map((image, index) => (
        <div
          key={index}
          className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer group transition-all duration-200"
          onClick={() => onImageClick(index)}
        >
          <img
            src={image}
            alt={`${alt} - ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      ))}
      
      {hasMoreImages && (
        <div
          className="flex-shrink-0 w-16 h-16 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer group transition-all duration-200 hover:bg-black/70"
          onClick={onViewMore}
        >
          <div className="text-center text-white">
            <svg className="w-3 h-3 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div className="text-xs font-semibold">+{remainingCount}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGrid;