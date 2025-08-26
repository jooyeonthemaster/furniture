'use client';

import { Plus, X } from 'lucide-react';
import { ProductForm } from '@/components/admin-product/types';

interface GuideTabProps {
  form: ProductForm;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
}

export default function GuideTab({
  form,
  handleNestedInputChange
}: GuideTabProps) {
  
  // 배열에 항목 추가
  const handleAddItem = (field: 'setup' | 'maintenance' | 'tips') => {
    const newItems = [...form.usageGuide[field], ''];
    handleNestedInputChange('usageGuide', field, newItems);
  };

  // 배열에서 항목 제거
  const handleRemoveItem = (field: 'setup' | 'maintenance' | 'tips', index: number) => {
    const newItems = form.usageGuide[field].filter((_, i) => i !== index);
    handleNestedInputChange('usageGuide', field, newItems);
  };

  // 배열 항목 수정
  const handleUpdateItem = (field: 'setup' | 'maintenance' | 'tips', index: number, value: string) => {
    const newItems = [...form.usageGuide[field]];
    newItems[index] = value;
    handleNestedInputChange('usageGuide', field, newItems);
  };

  return (
    <div className="space-y-8">
      {/* 설치/설정 가이드 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-medium">설치/설정 가이드</label>
          <button
            type="button"
            onClick={() => handleAddItem('setup')}
            className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>항목 추가</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {form.usageGuide.setup.length === 0 ? (
            <p className="text-muted-foreground text-sm">설치나 설정 방법을 추가해보세요.</p>
          ) : (
            form.usageGuide.setup.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-2">
                  {index + 1}
                </div>
                <textarea
                  value={item}
                  onChange={(e) => handleUpdateItem('setup', index, e.target.value)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary min-h-[80px] resize-y"
                  placeholder="설치/설정 단계를 입력하세요..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('setup', index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 유지보수 가이드 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-medium">유지보수 가이드</label>
          <button
            type="button"
            onClick={() => handleAddItem('maintenance')}
            className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>항목 추가</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {form.usageGuide.maintenance.length === 0 ? (
            <p className="text-muted-foreground text-sm">관리 및 유지보수 방법을 추가해보세요.</p>
          ) : (
            form.usageGuide.maintenance.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-2">
                  {index + 1}
                </div>
                <textarea
                  value={item}
                  onChange={(e) => handleUpdateItem('maintenance', index, e.target.value)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary min-h-[80px] resize-y"
                  placeholder="유지보수 방법을 입력하세요..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('maintenance', index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 사용 팁 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-medium">사용 팁</label>
          <button
            type="button"
            onClick={() => handleAddItem('tips')}
            className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>항목 추가</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {form.usageGuide.tips.length === 0 ? (
            <p className="text-muted-foreground text-sm">유용한 사용 팁을 추가해보세요.</p>
          ) : (
            form.usageGuide.tips.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-2">
                  💡
                </div>
                <textarea
                  value={item}
                  onChange={(e) => handleUpdateItem('tips', index, e.target.value)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary min-h-[80px] resize-y"
                  placeholder="사용 팁을 입력하세요..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('tips', index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 도움말 */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">💡 작성 가이드</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>설치/설정:</strong> 제품을 처음 사용할 때 필요한 단계별 안내</li>
          <li>• <strong>유지보수:</strong> 제품을 오래 사용하기 위한 관리 방법</li>
          <li>• <strong>사용 팁:</strong> 제품을 더 효과적으로 활용할 수 있는 노하우</li>
        </ul>
      </div>
    </div>
  );
}
