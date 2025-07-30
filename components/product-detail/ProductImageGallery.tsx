'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  discountPercentage: number;
}

export default function ProductImageGallery({ 
  images, 
  productName, 
  discountPercentage 
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <Image
          src={images[currentImageIndex] || '/placeholder-image.jpg'}
          alt={productName}
          fill
          quality={95}
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        />
        
        {/* 이미지 네비게이션 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* 할인 배지 */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
              {discountPercentage}% 할인
            </span>
          </div>
        )}
      </div>

      {/* 썸네일 이미지들 */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImageIndex ? 'border-foreground' : 'border-border'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                quality={90}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}