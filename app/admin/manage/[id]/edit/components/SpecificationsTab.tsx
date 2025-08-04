'use client';

import { ProductForm } from '../types';

interface SpecificationsTabProps {
  form: ProductForm;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
}

export default function SpecificationsTab({
  form,
  handleNestedInputChange
}: SpecificationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(form.specifications).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-2">
              {key === 'dimensions' ? '치수' :
               key === 'weight' ? '무게' :
               key === 'maxWeight' ? '최대 하중' :
               key === 'material' ? '소재' :
               key === 'color' ? '색상' :
               key === 'origin' ? '원산지' :
               key === 'year' ? '제조년도' : key}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleNestedInputChange('specifications', key, e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder={
                key === 'dimensions' ? '예: 100x80x50 (가로x높이x깊이)' :
                key === 'weight' ? '예: 25kg' :
                key === 'maxWeight' ? '예: 120kg' :
                key === 'material' ? '예: 메시, 알루미늄' :
                key === 'color' ? '예: 블랙' :
                key === 'origin' ? '예: 미국' :
                key === 'year' ? '예: 2023' : ''
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}