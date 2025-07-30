'use client';

import { useState } from 'react';
import { Plus, X, Eye } from 'lucide-react';
import SectionParser from '@/components/admin/SectionParser';
import OverviewImageUploader from '@/components/admin/OverviewImageUploader';
import { ProductForm } from './types';

interface AdminDescriptionProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
  handleArrayAdd: (field: string, value: string) => void;
  handleArrayRemove: (field: string, index: number) => void;
}

export default function AdminDescription({
  form,
  handleInputChange,
  handleNestedInputChange,
  handleArrayAdd,
  handleArrayRemove
}: AdminDescriptionProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [newTargetUser, setNewTargetUser] = useState('');
  const [newSuitableSpace, setNewSuitableSpace] = useState('');

  const handleAddTargetUser = () => {
    if (newTargetUser.trim()) {
      handleArrayAdd('targetUsers', newTargetUser.trim());
      setNewTargetUser('');
    }
  };

  const handleAddSuitableSpace = () => {
    if (newSuitableSpace.trim()) {
      handleArrayAdd('suitableSpaces', newSuitableSpace.trim());
      setNewSuitableSpace('');
    }
  };

  return (
    <div className="space-y-8">
      {/* 기본 상품 설명 */}
      <div className="bg-background border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">상품 설명 *</h3>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-muted rounded-lg hover:bg-muted/80"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? '편집' : '미리보기'}</span>
          </button>
        </div>
        
        {showPreview ? (
          <div className="min-h-[200px] p-4 border rounded-lg bg-muted/30 whitespace-pre-wrap">
            {form.description || '설명을 입력하세요...'}
          </div>
        ) : (
          <textarea
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-y"
            placeholder="상품에 대한 상세한 설명을 입력하세요..."
            required
          />
        )}
      </div>

      {/* 구조적 개요 설명 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">구조적 개요 설명</h3>
        <p className="text-sm text-muted-foreground mb-4">
          상품의 특징과 매력을 체계적으로 설명하는 개요입니다. 이 내용은 상품 상세 페이지의 개요 탭에 표시됩니다.
        </p>
        <textarea
          value={form.overviewDescription}
          onChange={(e) => handleInputChange('overviewDescription', e.target.value)}
          className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-y"
          placeholder="상품의 구조적 개요를 입력하세요..."
        />
      </div>

      {/* 개요 이미지 업로드 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">개요 이미지</h3>
        <p className="text-sm text-muted-foreground mb-4">
          상품 개요를 설명하는 전용 이미지들입니다. 상품 상세 페이지의 개요 탭에 세로로 표시됩니다.
        </p>
        <OverviewImageUploader
          images={form.overviewImages}
          onChange={(images) => handleInputChange('overviewImages', images)}
        />
      </div>

      {/* 상세 설명 섹션 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">상세 설명</h3>
        
        {/* 개요 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">개요</label>
          <textarea
            value={form.detailedDescription.overview}
            onChange={(e) => handleNestedInputChange('detailedDescription', 'overview', e.target.value)}
            className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-y"
            placeholder="상품의 전반적인 개요를 입력하세요..."
          />
        </div>

        {/* 대상 사용자 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">대상 사용자</label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTargetUser}
                onChange={(e) => setNewTargetUser(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTargetUser())}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="대상 사용자를 입력하세요 (예: 홈오피스 사용자)"
              />
              <button
                type="button"
                onClick={handleAddTargetUser}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {form.detailedDescription.targetUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">{user}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = form.detailedDescription.targetUsers.filter((_, i) => i !== index);
                      handleNestedInputChange('detailedDescription', 'targetUsers', newArray);
                    }}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 적합한 공간 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">적합한 공간</label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSuitableSpace}
                onChange={(e) => setNewSuitableSpace(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSuitableSpace())}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="적합한 공간을 입력하세요 (예: 홈오피스, 스터디룸)"
              />
              <button
                type="button"
                onClick={handleAddSuitableSpace}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {form.detailedDescription.suitableSpaces.map((space, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">{space}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = form.detailedDescription.suitableSpaces.filter((_, i) => i !== index);
                      handleNestedInputChange('detailedDescription', 'suitableSpaces', newArray);
                    }}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 디자인 스토리 */}
        <div>
          <label className="block text-sm font-medium mb-2">디자인 스토리</label>
          <textarea
            value={form.detailedDescription.designStory}
            onChange={(e) => handleNestedInputChange('detailedDescription', 'designStory', e.target.value)}
            className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-y"
            placeholder="제품의 디자인 배경이나 스토리를 입력하세요..."
          />
        </div>
      </div>

      {/* 섹션 파서 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">구조화된 설명</h3>
        <p className="text-sm text-muted-foreground mb-4">
          아래 텍스트를 입력하면 자동으로 구조화된 설명으로 변환됩니다.
        </p>
        <SectionParser
          rawText={form.rawDescriptionText}
          onTextChange={(text) => handleInputChange('rawDescriptionText', text)}
          onParsedDataChange={(data) => {
            // 파싱된 데이터를 폼에 반영
            if (data.description) {
              handleInputChange('description', data.description);
            }
            if (data.detailedDescription) {
              handleInputChange('detailedDescription', data.detailedDescription);
            }
          }}
        />
      </div>
    </div>
  );
}