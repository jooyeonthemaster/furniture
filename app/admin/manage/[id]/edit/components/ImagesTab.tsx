'use client';

import ImageUploader from '@/components/admin/ImageUploader';
import { ProductForm } from '@/components/admin-product/types';

interface ImagesTabProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
}

export default function ImagesTab({
  form,
  handleInputChange
}: ImagesTabProps) {
  // handleInputChange가 함수인지 확인
  if (typeof handleInputChange !== 'function') {
    console.error('handleInputChange is not a function:', handleInputChange);
    return <div className="p-4 text-red-500">이미지 업로더 로딩 중...</div>;
  }

  return (
    <ImageUploader
      images={form.images || []}
      onImagesChange={(images) => {
        console.log('Images changed:', images);
        handleInputChange('images', images);
      }}
      maxImages={10}
      maxFileSize={5}
    />
  );
}