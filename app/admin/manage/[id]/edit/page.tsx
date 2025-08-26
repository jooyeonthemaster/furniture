'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Copy, X } from 'lucide-react';
import Link from 'next/link';

// 분리된 컴포넌트들 import
import BasicInfoTab from './components/BasicInfoTab';
import DescriptionTab from './components/DescriptionTab';
import ConditionTab from './components/ConditionTab';
import GuideTab from './components/GuideTab';
import SpecificationsTab from './components/SpecificationsTab';
import ImagesTab from './components/ImagesTab';
import RelatedProductsTab from './components/RelatedProductsTab';
import SourceTab from './components/SourceTab';

// 커스텀 훅과 타입들
import { useEditProduct } from './hooks/useEditProduct';
import { tabs } from './types';

export default function EditProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id as string;
  const isCopied = searchParams.get('copied') === 'true';
  
  const [currentTab, setCurrentTab] = useState('basic');
  const [showCopyAlert, setShowCopyAlert] = useState(isCopied);
  
  // 커스텀 훅으로 모든 폼 로직 처리
  const {
    form,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleNestedInputChange,
    handleArrayAdd,
    handleArrayRemove,
    handleSubmit
  } = useEditProduct(productId);

  // 탭별 컴포넌트 렌더링 함수
  const renderTabContent = () => {
    // 핸들러 함수들이 제대로 정의되었는지 확인
    if (typeof handleInputChange !== 'function') {
      console.error('EditProductPage: handleInputChange is not a function');
      return (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">데이터 로딩 중...</p>
        </div>
      );
    }

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
        console.log('EditProductPage: Rendering DescriptionTab, handleInputChange type:', typeof handleInputChange);
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
      case 'guide':
        return (
          <GuideTab
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
            productId={productId}
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

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* 복사 완료 알림 */}
        {showCopyAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Copy className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h3 className="text-green-800 font-medium">상품 복사 완료!</h3>
                  <p className="text-green-700 text-sm">
                    원본 상품이 성공적으로 복사되었습니다. 필요한 정보를 수정한 후 저장하세요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCopyAlert(false)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

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
              <h1 className="text-2xl font-bold">상품 수정</h1>
              <p className="text-muted-foreground">
                상품 정보를 수정하세요
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