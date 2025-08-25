'use client';

import { ProductForm, sourceTypes } from '@/components/admin-product/types';

interface SourceTabProps {
  form: ProductForm;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
}

export default function SourceTab({
  form,
  handleNestedInputChange
}: SourceTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">소스 타입</label>
          <select
            value={form.source.type}
            onChange={(e) => handleNestedInputChange('source', 'type', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            {sourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">소스명</label>
          <input
            type="text"
            value={form.source.name}
            onChange={(e) => handleNestedInputChange('source', 'name', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 롯데캐슬 모델하우스"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">위치</label>
          <input
            type="text"
            value={form.source.location}
            onChange={(e) => handleNestedInputChange('source', 'location', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 서울 강남구"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">날짜</label>
          <input
            type="date"
            value={form.source.date}
            onChange={(e) => handleNestedInputChange('source', 'date', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">사용 내역</label>
        <textarea
          value={form.source.usage}
          onChange={(e) => handleNestedInputChange('source', 'usage', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="예: 3년간 모델하우스 전시용으로 사용, 실제 거주 없음"
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">배송 정보</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="free-shipping"
              checked={form.shipping.free}
              onChange={(e) => handleNestedInputChange('shipping', 'free', e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="free-shipping" className="text-sm font-medium">
              무료 배송
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">배송 기간</label>
              <input
                type="text"
                value={form.shipping.period}
                onChange={(e) => handleNestedInputChange('shipping', 'period', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="예: 3-5일"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">설치비</label>
              <input
                type="number"
                value={form.shipping.installationFee}
                onChange={(e) => handleNestedInputChange('shipping', 'installationFee', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="installation"
              checked={form.shipping.installation}
              onChange={(e) => handleNestedInputChange('shipping', 'installation', e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="installation" className="text-sm font-medium">
              설치 서비스 제공
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}