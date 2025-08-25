'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

// 수정 페이지의 깔끔한 컴포넌트들 사용
import BasicInfoTab from '../[id]/edit/components/BasicInfoTab';
import DescriptionTab from '../[id]/edit/components/DescriptionTab';
import ConditionTab from '../[id]/edit/components/ConditionTab';
import SpecificationsTab from '../[id]/edit/components/SpecificationsTab';
import ImagesTab from '../[id]/edit/components/ImagesTab';
import SourceTab from '../[id]/edit/components/SourceTab';
import RelatedProductsTab from '../[id]/edit/components/RelatedProductsTab';

// 커스텀 훅
import { useAddProduct } from './hooks/useAddProduct';

export default function AddProductPage() {
  const [currentTab, setCurrentTab] = useState('basic');
  const [newTag, setNewTag] = useState('');
  
  // 커스텀 훅으로 모든 폼 로직 처리
  const {
    form,
    isSubmitting,
    handleInputChange,
    handleNestedInputChange,
    handleArrayAdd,
    handleArrayRemove,
    handleSubmit
  } = useAddProduct();

  // 태그 관련 헬퍼 함수들
  const handleTagAdd = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      handleArrayAdd('tags', newTag.trim());
      setNewTag('');
    }
  };

  // 탭 정의 (수정 페이지와 동일)
  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'description', label: '상품 설명' },
    { id: 'condition', label: '상태 정보' },
    { id: 'specifications', label: '제품 사양' },
    { id: 'images', label: '이미지' },
    { id: 'related', label: '연계 상품' },
    { id: 'source', label: '소스 정보' }
  ];

  // 탭별 컴포넌트 렌더링 함수 (수정 페이지와 동일한 컴포넌트 사용)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'basic':
        return (
          <BasicInfoTab
            form={form}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            handleArrayAdd={handleArrayAdd}
            handleArrayRemove={handleArrayRemove}
          />
        );
      case 'description':
        return (
          <DescriptionTab
            form={form}
            handleInputChange={handleInputChange}
          />
        );
      case 'condition':
        return (
          <ConditionTab
            form={form}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      case 'specifications':
        return (
          <SpecificationsTab
            form={form}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      case 'images':
        return (
          <ImagesTab
            form={form}
            handleInputChange={handleInputChange}
          />
        );
      case 'related':
        return (
          <RelatedProductsTab
            form={form}
            handleInputChange={handleInputChange}
            productId="" // 새 상품이므로 빈 문자열
          />
        );
      case 'source':
        return (
          <SourceTab
            form={form}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/manage"
              className="p-2 hover:bg-muted rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">상품 등록</h1>
              <p className="text-muted-foreground">
                새로운 상품을 등록하세요
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-muted"
            >
              <Eye className="w-4 h-4" />
              <span>미리보기</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                currentTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 폼 내용 */}
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-lg border p-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}