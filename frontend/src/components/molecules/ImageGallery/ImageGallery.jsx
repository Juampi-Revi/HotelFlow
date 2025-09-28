import React from 'react';
import { useTranslation } from 'react-i18next';
import useImageGallery from '../../../hooks/useImageGallery';
import MainImage from '../../atoms/MainImage/MainImage';
import ThumbnailGrid from '../../atoms/ThumbnailGrid/ThumbnailGrid';
import ThumbnailColumn from '../../atoms/ThumbnailColumn/ThumbnailColumn';
import ImageModal from '../ImageModal/ImageModal';

const ImageGallery = ({ images = [], alt = 'Gallery image' }) => {
  const { t } = useTranslation();
  const {
    selectedImageIndex,
    isModalOpen,
    modalImageIndex,
    displayImages,
    mainImage,
    gridImages,
    hasMoreImages,
    handleImageClick,
    handleViewMore,
    closeModal,
    nextImage,
    prevImage,
    goToImage
  } = useImageGallery(images);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">{t('common.noImages')}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {images.length >= 5 ? (
          // Layout for 5+ images: Main image left (50%) + Grid right (50%)
          <div className="relative flex gap-4 h-96">
            {/* Main Image - Left 50% */}
            <div className="w-1/2">
              <MainImage
                src={displayImages[selectedImageIndex] || mainImage}
                alt={`${alt} - Main`}
              />
            </div>

            {/* Secondary images grid - 2x2 Layout */}
            <div className="w-1/2">
              <ThumbnailGrid
                images={gridImages}
                alt={alt}
                onImageClick={handleImageClick}
                onViewMore={handleViewMore}
                hasMoreImages={hasMoreImages}
                totalImages={images.length}
                layout="desktop"
              />
            </div>
          </div>
        ) : (
          // Layout for less than 5 images: Large main image + small thumbnails on the side
          <div className="relative flex gap-4 h-96">
            {/* Main Image - Takes most space */}
            <div className="flex-1">
              <MainImage
                src={displayImages[selectedImageIndex] || mainImage}
                alt={`${alt} - Main`}
              />
            </div>

            {/* Thumbnail column on the right */}
            {images.length > 1 && (
              <ThumbnailColumn
                images={images}
                alt={alt}
                selectedImageIndex={selectedImageIndex}
                onImageClick={handleImageClick}
                onViewMore={handleViewMore}
              />
            )}
          </div>
        )}
      </div>

      {/* Mobile/Tablet Layout: Vertical Stack */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {/* Main Image */}
          <MainImage
            src={displayImages[selectedImageIndex] || mainImage}
            alt={`${alt} - Main`}
            className="h-64"
          />
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <ThumbnailGrid
              images={images.slice(0, 6)}
              alt={alt}
              onImageClick={handleImageClick}
              onViewMore={handleViewMore}
              hasMoreImages={images.length > 6}
              totalImages={images.length}
              layout="mobile"
            />
          )}
        </div>
      </div>

      {/* Modal to view all images */}
      <ImageModal
        isOpen={isModalOpen}
        images={images}
        currentIndex={modalImageIndex}
        alt={alt}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
        onGoToImage={goToImage}
      />
    </div>
  );
};

export default ImageGallery;