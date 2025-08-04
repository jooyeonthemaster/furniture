'use client';

import { Plus, X } from 'lucide-react';
import { ProductForm } from '../types';

interface ConditionTabProps {
  form: ProductForm;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
}

export default function ConditionTab({
  form,
  handleNestedInputChange
}: ConditionTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">전체 상태</label>
        <select
          value={form.conditionReport.overall}
          onChange={(e) => handleNestedInputChange('conditionReport', 'overall', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="A급">A급 (최상)</option>
          <option value="B급">B급 (상)</option>
          <option value="C급">C급 (중)</option>
          <option value="D급">D급 (하)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">장점</label>
        <div className="space-y-2">
          {form.conditionReport.strengths.map((strength, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={strength}
                onChange={(e) => {
                  const newStrengths = [...form.conditionReport.strengths];
                  newStrengths[index] = e.target.value;
                  handleNestedInputChange('conditionReport', 'strengths', newStrengths);
                }}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  const newStrengths = form.conditionReport.strengths.filter((_, i) => i !== index);
                  handleNestedInputChange('conditionReport', 'strengths', newStrengths);
                }}
                className="p-2 text-red-500 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              handleNestedInputChange('conditionReport', 'strengths', [...form.conditionReport.strengths, '']);
            }}
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            <span>장점 추가</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">단점/결함</label>
        <div className="space-y-2">
          {form.conditionReport.minorFlaws.map((flaw, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={flaw}
                onChange={(e) => {
                  const newFlaws = [...form.conditionReport.minorFlaws];
                  newFlaws[index] = e.target.value;
                  handleNestedInputChange('conditionReport', 'minorFlaws', newFlaws);
                }}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  const newFlaws = form.conditionReport.minorFlaws.filter((_, i) => i !== index);
                  handleNestedInputChange('conditionReport', 'minorFlaws', newFlaws);
                }}
                className="p-2 text-red-500 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              handleNestedInputChange('conditionReport', 'minorFlaws', [...form.conditionReport.minorFlaws, '']);
            }}
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            <span>단점 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}