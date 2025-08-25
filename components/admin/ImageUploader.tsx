'use client';

import { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import Image from 'next/image';
import { 
  Upload, X, Star, Eye, Move, Image as ImageIcon, 
  Download, Trash2, RotateCw, Crop, Edit3, CheckCircle, AlertCircle,
  GripVertical, ArrowUp, ArrowDown
} from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  publicId?: string;
  isPrimary: boolean;
  alt?: string;
  caption?: string;
}

interface ImageUploaderProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  maxFileSize?: number; // MB
  acceptedTypes?: string[];
  uploadFolder?: string;
}

export default function ImageUploader({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  uploadFolder = 'furniture'
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<ImageItem | null> => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      console.log('Cloud Name:', cloudName);
      
      if (!cloudName) {
        throw new Error('Cloudinary Cloud Name이 설정되지 않았습니다.');
      }

      // FormData 생성 (Unsigned 업로드)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'furniture'); // 실제 preset 이름으로 변경
      formData.append('folder', uploadFolder);

      console.log('업로드 URL:', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

      // Cloudinary 업로드 (Unsigned)
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text();
        console.error('Cloudinary 응답 에러:', errorData);
        throw new Error(`Cloudinary 업로드 실패: ${uploadResponse.status}`);
      }

      const result = await uploadResponse.json();
      console.log('업로드 성공:', result);

      return {
        id: result.public_id,
        url: result.secure_url,
        publicId: result.public_id,
        isPrimary: images.length === 0,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        caption: ''
      };
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      return null;
    }
  };

  const handleFileSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // 파일 타입 검증
      if (!acceptedTypes.includes(file.type)) {
        setUploadErrors(prev => [...prev, `지원하지 않는 파일 형식: ${file.name}`]);
        return false;
      }
      
      // 파일 크기 검증
      if (file.size > maxFileSize * 1024 * 1024) {
        setUploadErrors(prev => [...prev, `파일 크기 초과 (최대 ${maxFileSize}MB): ${file.name}`]);
        return false;
      }
      
      return true;
    });

    if (images.length + validFiles.length > maxImages) {
      setUploadErrors(prev => [...prev, `최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`]);
      return;
    }

    setUploading(true);
    setUploadErrors([]);
    const newImages: ImageItem[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const tempId = `temp-${Date.now()}-${i}`;
      
      try {
        setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));
        
        // 업로드 진행률 시뮬레이션 (실제로는 Cloudinary SDK의 progress 콜백 사용)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[tempId] || 0;
            if (current < 90) {
              return { ...prev, [tempId]: current + 10 };
            }
            return prev;
          });
        }, 200);

        const uploadedImage = await uploadToCloudinary(file);
        
        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [tempId]: 100 }));

        if (uploadedImage) {
          newImages.push(uploadedImage);
        } else {
          setUploadErrors(prev => [...prev, `업로드 실패: ${file.name}`]);
        }

        // 진행률 정리
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [tempId]: removed, ...rest } = prev;
            return rest;
          });
        }, 1000);

      } catch (error) {
        setUploadErrors(prev => [...prev, `업로드 실패: ${file.name}`]);
      }
    }

    // onImagesChange가 함수인지 확인
    if (typeof onImagesChange === 'function') {
      onImagesChange([...images, ...newImages]);
    } else {
      console.error('onImagesChange is not a function:', onImagesChange);
    }
    setUploading(false);
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

  const handleSetPrimary = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    if (typeof onImagesChange === 'function') {
      onImagesChange(updatedImages);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // 대표 이미지를 삭제했을 경우 첫 번째 이미지를 대표로 설정
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    
    if (typeof onImagesChange === 'function') {
      onImagesChange(updatedImages);
    }
  };

  const handleReorder = (newImages: ImageItem[]) => {
    // 첫 번째 이미지를 자동으로 대표 이미지로 설정
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      isPrimary: index === 0
    }));
    if (typeof onImagesChange === 'function') {
      onImagesChange(reorderedImages);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    handleReorder(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    handleReorder(newImages);
  };

  const handleEditImage = (image: ImageItem) => {
    setEditingImage(image.id);
    setImageAlt(image.alt || '');
    setImageCaption(image.caption || '');
  };

  const handleSaveEdit = () => {
    if (!editingImage) return;
    
    const updatedImages = images.map(img => 
      img.id === editingImage 
        ? { ...img, alt: imageAlt, caption: imageCaption }
        : img
    );
    
    if (typeof onImagesChange === 'function') {
      onImagesChange(updatedImages);
    }
    setEditingImage(null);
    setImageAlt('');
    setImageCaption('');
  };

  const clearErrors = () => {
    setUploadErrors([]);
  };

  return (
    <div className="space-y-6">
      {/* 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
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
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">
              {uploading ? '업로드 중...' : '이미지 업로드'}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              파일을 드래그하거나 클릭하여 업로드하세요
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedTypes.map(type => type.split('/')[1]).join(', ')} 형식, 최대 {maxFileSize}MB
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
            <h3 className="text-sm font-medium">
              업로드된 이미지 ({images.length}/{maxImages})
            </h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <GripVertical className="w-4 h-4" />
              <span>드래그하여 순서 변경 • 첫 번째 이미지가 대표 이미지로 설정됩니다</span>
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
                <div className={`flex items-center p-4 transition-all duration-200 ${
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
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>

                  {/* 순서 번호 */}
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    {index === 0 && (
                      <span className="text-xs text-primary font-medium mt-1">대표</span>
                    )}
                  </div>

                  {/* 이미지 미리보기 */}
                  <div className="relative mr-4">
                    <Image
                      src={image.url}
                      alt={image.alt || '상품 이미지'}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover border-2 border-transparent"
                    />
                    {image.isPrimary && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* 이미지 정보 */}
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">{image.alt || '제목 없음'}</div>
                    {image.caption && (
                      <div className="text-xs text-muted-foreground">{image.caption}</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Public ID: {image.publicId}
                    </div>
                  </div>

                  {/* 순서 변경 버튼들 */}
                  <div className="flex flex-col space-y-1 mr-4">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="위로 이동"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="아래로 이동"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex items-center space-x-2">
                    {!image.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        className="p-2 hover:bg-muted rounded-full"
                        title="대표 이미지로 설정"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEditImage(image)}
                      className="p-2 hover:bg-muted rounded-full"
                      title="정보 수정"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-full"
                      title="이미지 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* 순서 변경 안내 */}
          {images.length > 1 && (
            <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 flex items-center space-x-2">
              <Move className="w-4 h-4" />
              <span>
                <strong>팁:</strong> 첫 번째 이미지가 자동으로 대표 이미지로 설정됩니다. 
                드래그하거나 화살표 버튼으로 순서를 변경하세요.
              </span>
            </div>
          )}
        </div>
      )}

      {/* 이미지 편집 모달 */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">이미지 정보 수정</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">대체 텍스트 (Alt)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                  placeholder="이미지 설명"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">캡션</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                  placeholder="이미지 캡션"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 