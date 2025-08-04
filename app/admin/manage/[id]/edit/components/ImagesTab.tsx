'use client';

import ImageUploader from '@/components/admin/ImageUploader';
import { ProductForm } from '../types';

interface ImagesTabProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
}

export default function ImagesTab({
  form,
  handleInputChange
}: ImagesTabProps) {
  return (
    <ImageUploader
      images={form.images}
      onImagesChange={(images) => handleInputChange('images', images)}
      maxImages={10}
      maxFileSize={5}
    />
  );
}