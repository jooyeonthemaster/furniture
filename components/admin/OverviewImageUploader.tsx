'use client';

import { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import Image from 'next/image';
import { 
  Upload, X, Eye, Move, GripVertical, ArrowUp, ArrowDown, AlertCircle
} from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface OverviewImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface OverviewImageUploaderProps {
  images: OverviewImage[];
  onImagesChange: (images: OverviewImage[]) => void;
  maxImages?: number;
  maxFileSize?: number; // MB
}

export default function OverviewImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5
}: OverviewImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // 파일 수량 체크
    if (images.length + fileArray.length > maxImages) {
      setUploadErrors([`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`]);
      return;
    }

    setUploading(true);
    setUploadErrors([]);

    try {
      console.log('개요 이미지 업로드 시작:', fileArray.length, '개 파일');
      
      const uploadPromises = fileArray.map(async (file, index) => {
        const tempId = `temp-${Date.now()}-${index}`;
        
        try {
          // 파일 크기 체크
          if (file.size > maxFileSize * 1024 * 1024) {
            throw new Error(`파일 크기가 ${maxFileSize}MB를 초과합니다: ${file.name}`);
          }

          // 파일 타입 체크
          if (!file.type.startsWith('image/')) {
            throw new Error(`이미지 파일만 업로드 가능합니다: ${file.name}`);
          }

          setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));
          
          // 진행률 시뮬레이션
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const current = prev[tempId] || 0;
              if (current < 90) {
                return { ...prev, [tempId]: current + 10 };
              }
              return prev;
            });
          }, 200);

          const result = await uploadToCloudinary(file, 'furniture/overview');
          
          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [tempId]: 100 }));

          // 진행률 정리
          setTimeout(() => {
            setUploadProgress(prev => {
              const { [tempId]: removed, ...rest } = prev;
              return rest;
            });
          }, 1000);

          return {
            id: result.public_id,
            url: result.secure_url,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            caption: ''
          };
        } catch (error) {
          console.error(`파일 ${file.name} 업로드 실패:`, error);
          setUploadErrors(prev => [...prev, `업로드 실패: ${file.name} - ${(error as Error).message}`]);
          return null;
        }
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as OverviewImage[];
      
      if (uploadedImages.length > 0) {
        onImagesChange([...images, ...uploadedImages]);
        console.log('개요 이미지 업로드 완료:', uploadedImages.length, '개');
      }
    } catch (error) {
      console.error('업로드 중 오류:', error);
      setUploadErrors(prev => [...prev, '이미지 업로드 중 오류가 발생했습니다.']);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleReorder = (newImages: OverviewImage[]) => {
    onImagesChange(newImages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    onImagesChange(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    onImagesChange(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleUpdateImageInfo = (index: number, field: 'alt' | 'caption', value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onImagesChange(newImages);
  };

  const clearErrors = () => {
    setUploadErrors([]);
  };

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {uploading ? '업로드 중...' : '클릭하여 개요 이미지를 업로드하거나'}
            </p>
            {!uploading && (
              <p className="text-sm text-muted-foreground">
                파일을 여기로 드래그 앤 드롭하세요
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WebP (최대 {maxFileSize}MB)
            </p>
          </div>
        </div>
      </div>

      {/* 업로드 진행률 */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>업로드 중...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 에러 메시지 */}
      {uploadErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-destructive mb-2">업로드 오류</h4>
              <ul className="text-sm text-destructive/80 space-y-1">
                {uploadErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
              <button 
                onClick={clearErrors}
                className="text-xs text-destructive hover:text-destructive/80 mt-2"
              >
                오류 메시지 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 업로드된 이미지 목록 */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              개요 이미지 ({images.length}/{maxImages})
            </h4>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <GripVertical className="w-4 h-4" />
              <span>드래그하여 순서 변경</span>
            </div>
          </div>

          <Reorder.Group
            axis="y"
            values={images}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {images.map((image, index) => (
              <Reorder.Item
                key={image.id}
                value={image}
                dragListener={false}
                className="bg-card border rounded-lg overflow-hidden"
                onDragStart={() => setDraggedItem(image.id)}
                onDragEnd={() => setDraggedItem(null)}
              >
                <div className={`flex items-center p-3 transition-all duration-200 ${
                  draggedItem === image.id ? 'bg-primary/5 shadow-lg scale-[1.02]' : 'hover:bg-muted/50'
                }`}>
                  {/* 드래그 핸들 */}
                  <div 
                    className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded mr-3"
                    onPointerDown={(e) => {
                      (e.target as HTMLElement).closest('[data-framer-name="reorder-item"]')?.dispatchEvent(
                        new PointerEvent('pointerdown', { pointerId: e.pointerId, bubbles: true })
                      );
                    }}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* 순서 번호 */}
                  <div className="flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground text-xs font-medium rounded-full mr-3">
                    {index + 1}
                  </div>

                  {/* 이미지 미리보기 */}
                  <div className="relative w-16 h-16 flex-shrink-0 mr-4">
                    <Image
                      src={image.url}
                      alt={image.alt || `개요 이미지 ${index + 1}`}
                      fill
                      className="object-cover rounded border"
                    />
                  </div>

                  {/* 이미지 정보 입력 */}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => handleUpdateImageInfo(index, 'alt', e.target.value)}
                      className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary"
                      placeholder="이미지 설명 (선택사항)"
                    />
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => handleUpdateImageInfo(index, 'caption', e.target.value)}
                      className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary"
                      placeholder="캡션 (선택사항)"
                    />
                  </div>

                  {/* 순서 변경 버튼들 */}
                  <div className="flex flex-col space-y-1 mr-3">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="위로 이동"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="아래로 이동"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded"
                    title="이미지 삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* 순서 변경 안내 */}
          {images.length > 1 && (
            <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 flex items-center space-x-2">
              <Move className="w-4 h-4" />
              <span>
                <strong>팁:</strong> 드래그하거나 화살표 버튼으로 이미지 순서를 변경할 수 있습니다.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 