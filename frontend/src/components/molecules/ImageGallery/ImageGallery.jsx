import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ImageGallery = ({ images = [], alt = 'Gallery image' }) => {
  const { t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">{t('common.noImages')}</span>
      </div>
    );
  }

  const displayImages = images.slice(0, 5);
  const mainImage = displayImages[0];
  const gridImages = displayImages.slice(1, 5);
  const hasMoreImages = images.length > 5;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleViewMore = () => {
    setIsModalOpen(true);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setModalImageIndex(index);
  };

  return (
    <div className="w-full">
      {/* Desktop Layout: Main image left (50%) + Grid right (50%) */}
      <div className="hidden md:block">
        <div className="relative flex gap-4 h-96">
          {/* Main Image - Left 50% */}
          <div className="w-1/2">
            <div className="relative h-full rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={displayImages[selectedImageIndex] || mainImage}
                alt={`${alt} - Main`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Secondary images grid - 2x2 Layout */}
          {gridImages.length > 0 && (
            <div className="w-1/2">
              <div className="grid grid-cols-2 gap-2 h-full">
                {Array.from({ length: 4 }).map((_, index) => {
                  const image = gridImages[index];
                  const actualIndex = index + 1;
                  const isLastImage = index === 3;
                  const showViewMore = isLastImage && hasMoreImages;
                  
                  return (
                    <div
                      key={actualIndex}
                      className="relative rounded-md overflow-hidden cursor-pointer group"
                      onClick={() => image && handleImageClick(actualIndex)}
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
                      
                      {/* View more button overlay on last image */}
                      {showViewMore && (
                        <div 
                          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMore();
                          }}
                        >
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <div className="text-sm font-semibold">{t('gallery.viewMore')}</div>
                            <div className="text-xs text-gray-200 mt-1">+{images.length - 5}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Layout: Vertical Stack */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
            <img
              src={displayImages[selectedImageIndex] || mainImage}
              alt={`${alt} - Main`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Grid Images */}
          {gridImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => {
                const image = gridImages[index];
                const actualIndex = index + 1;
                const isLastImage = index === 3;
                const showViewMore = isLastImage && hasMoreImages;
                
                if (!image && !showViewMore) {
                  return (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg"
                    />
                  );
                }
                
                return (
                  <div
                    key={actualIndex}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => image && handleImageClick(actualIndex)}
                  >
                    {image && (
                      <img
                        src={image}
                        alt={`${alt} - ${actualIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    
                    {showViewMore && (
                      <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMore();
                        }}
                      >
                        <div className="text-center text-white">
                          <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <div className="text-xs font-semibold">{t('gallery.viewMore')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal to view all images */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-6xl max-h-screen p-2 sm:p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main modal image */}
            <div className="flex items-center justify-center h-full pb-20 sm:pb-24">
              <div className="relative max-w-full max-h-full">
                <img
                  src={images[modalImageIndex]}
                  alt={`${alt} - ${modalImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                
                {/* Navigation controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom thumbnails */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-2">
              <div className="flex justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === modalImageIndex
                        ? 'border-white shadow-lg'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${alt} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {/* Image counter */}
              <div className="text-center mt-1 sm:mt-2">
                <span className="text-white/80 text-xs sm:text-sm">
                  {modalImageIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;