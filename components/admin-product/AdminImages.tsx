'use client';

import ImageUploader from '@/components/admin/ImageUploader';
import { ProductForm } from './types';

interface AdminImagesProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 더 이상 사용하지 않음
}

export default function AdminImages({ 
  form, 
  handleInputChange
}: AdminImagesProps) {
  // handleInputChange가 함수인지 확인
  if (typeof handleInputChange !== 'function') {
    console.error('AdminImages: handleInputChange is not a function:', handleInputChange);
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">이미지 업로더 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ImageUploader 컴포넌트 사용 */}
      <ImageUploader
        images={form.images || []}
        onImagesChange={(images) => {
          console.log('AdminImages: Images changed:', images);
          handleInputChange('images', images);
        }}
        maxImages={10}
        maxFileSize={10}
        uploadFolder="furniture/products"
      />
    </div>
  );
}