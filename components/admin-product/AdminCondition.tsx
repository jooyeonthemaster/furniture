'use client';

import { Plus, X } from 'lucide-react';
import { ProductForm } from './types';

interface AdminConditionProps {
  form: ProductForm;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
}

export default function AdminCondition({ form, handleNestedInputChange }: AdminConditionProps) {
  const addConditionDetail = () => {
    const newDetail = { item: '', condition: '', note: '' };
    const newDetails = [...form.conditionReport.details, newDetail];
    handleNestedInputChange('conditionReport', 'details', newDetails);
  };

  const updateConditionDetail = (index: number, field: string, value: string) => {
    const newDetails = form.conditionReport.details.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    );
    handleNestedInputChange('conditionReport', 'details', newDetails);
  };

  const removeConditionDetail = (index: number) => {
    const newDetails = form.conditionReport.details.filter((_, i) => i !== index);
    handleNestedInputChange('conditionReport', 'details', newDetails);
  };

  const addToArray = (arrayPath: string, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = form.conditionReport[arrayPath as keyof typeof form.conditionReport] as string[];
    const newArray = [...currentArray, value.trim()];
    handleNestedInputChange('conditionReport', arrayPath, newArray);
  };

  const removeFromArray = (arrayPath: string, index: number) => {
    const currentArray = form.conditionReport[arrayPath as keyof typeof form.conditionReport] as string[];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleNestedInputChange('conditionReport', arrayPath, newArray);
  };

  return (
    <div className="space-y-8">
      {/* 전체 상태 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">전체 상태</h3>
        <div>
          <label className="block text-sm font-medium mb-2">전체 상태 평가</label>
          <input
            type="text"
            value={form.conditionReport.overall}
            onChange={(e) => handleNestedInputChange('conditionReport', 'overall', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: A급, 우수함, 매우 좋음"
          />
        </div>
      </div>

      {/* 세부 상태 */}
      <div className="bg-background border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">세부 상태</h3>
          <button
            type="button"
            onClick={addConditionDetail}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>항목 추가</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {form.conditionReport.details.map((detail, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">항목</label>
                <input
                  type="text"
                  value={detail.item}
                  onChange={(e) => updateConditionDetail(index, 'item', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  placeholder="예: 시트, 팔걸이, 바퀴"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">상태</label>
                <input
                  type="text"
                  value={detail.condition}
                  onChange={(e) => updateConditionDetail(index, 'condition', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  placeholder="예: 매우 좋음, 양호"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">비고</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={detail.note}
                    onChange={(e) => updateConditionDetail(index, 'note', e.target.value)}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
                    placeholder="추가 설명"
                  />
                  <button
                    type="button"
                    onClick={() => removeConditionDetail(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {form.conditionReport.details.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p>세부 상태 항목이 없습니다.</p>
              <p className="text-sm mt-1">상단의 "항목 추가" 버튼을 클릭하여 추가하세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 장점 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">장점</h3>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="장점을 입력하세요"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  addToArray('strengths', input.value);
                  input.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addToArray('strengths', input.value);
                input.value = '';
              }}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {form.conditionReport.strengths.map((strength, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-sm">{strength}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('strengths', index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주의사항/결함 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">주의사항/결함</h3>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="주의사항이나 결함을 입력하세요"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  addToArray('minorFlaws', input.value);
                  input.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addToArray('minorFlaws', input.value);
                input.value = '';
              }}
              className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {form.conditionReport.minorFlaws.map((flaw, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="text-sm">{flaw}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('minorFlaws', index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}