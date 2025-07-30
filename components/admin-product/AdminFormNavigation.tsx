'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminFormNavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function AdminFormNavigation({ currentTab, setCurrentTab }: AdminFormNavigationProps) {
  const router = useRouter();

  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'description', label: '상품 설명' },
    { id: 'condition', label: '상태 정보' },
    { id: 'guide', label: '사용 가이드' },
    { id: 'specifications', label: '제품 사양' },
    { id: 'images', label: '이미지' },
    { id: 'source', label: '소스 정보' }
  ];

  return (
    <div className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold">상품 추가</h1>
              <p className="text-muted-foreground">새로운 상품을 등록하세요</p>
            </div>
          </div>
          <Link 
            href="/admin/manage"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            관리 페이지로 돌아가기
          </Link>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}