'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Star } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { ProductForm } from './types';

interface AdminImagesProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AdminImages({ 
  form, 
  handleInputChange, 
  handleImageUpload 
}: AdminImagesProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // 가상의 input 이벤트 생성
      const fakeEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageUpload(fakeEvent);
    }
  };

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index);
    handleInputChange('images', newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = form.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    handleInputChange('images', newImages);
  };

  const updateImageInfo = (index: number, field: string, value: string) => {
    const newImages = form.images.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    );
    handleInputChange('images', newImages);
  };

  return (
    <div className="space-y-8">
      {/* 이미지 업로드 영역 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">상품 이미지 *</h3>
        <p className="text-sm text-muted-foreground mb-4">
          상품의 메인 이미지들을 업로드하세요. 첫 번째 이미지가 대표 이미지로 설정됩니다.
        </p>

        {/* 드래그 앤 드롭 영역 */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">이미지를 드래그하여 업로드</p>
          <p className="text-sm text-muted-foreground mb-4">
            또는 클릭하여 파일을 선택하세요
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            파일 선택
          </label>
        </div>

        {/* 업로드된 이미지 목록 */}
        {form.images.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-4">업로드된 이미지 ({form.images.length}개)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {form.images.map((image, index) => (
                <div key={image.id} className="relative border rounded-lg overflow-hidden">
                  {/* 이미지 */}
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={image.url}
                      alt={image.alt || `상품 이미지 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    
                    {/* 대표 이미지 표시 */}
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>대표</span>
                        </span>
                      </div>
                    )}
                    
                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 이미지 정보 */}
                  <div className="p-3 space-y-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">대체 텍스트</label>
                      <input
                        type="text"
                        value={image.alt || ''}
                        onChange={(e) => updateImageInfo(index, 'alt', e.target.value)}
                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-primary"
                        placeholder="이미지 설명"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">캡션</label>
                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => updateImageInfo(index, 'caption', e.target.value)}
                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-primary"
                        placeholder="이미지 캡션"
                      />
                    </div>
                    
                    {!image.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="w-full px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                      >
                        대표 이미지로 설정
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 이미지 업로더 컴포넌트 (기존) */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-4">고급 이미지 업로더</h4>
          <ImageUploader
            images={form.images}
            onChange={(images) => handleInputChange('images', images)}
            maxImages={10}
          />
        </div>
      </div>

      {/* 이미지 가이드라인 */}
      <div className="bg-muted/30 border rounded-lg p-6">
        <h4 className="font-medium mb-3">이미지 가이드라인</h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• 권장 해상도: 1200x1200px 이상</li>
          <li>• 지원 형식: JPG, PNG, WebP</li>
          <li>• 최대 파일 크기: 10MB</li>
          <li>• 첫 번째 이미지가 자동으로 대표 이미지로 설정됩니다</li>
          <li>• 최소 1개, 최대 10개까지 업로드 가능합니다</li>
          <li>• 상품의 다양한 각도에서 촬영한 이미지를 업로드해주세요</li>
        </ul>
      </div>
    </div>
  );
}