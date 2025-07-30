'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getProduct, copyProduct } from '@/lib/products';
import { Product } from '@/types';

export default function CopyProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 원본 상품 데이터 로드
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const product = await getProduct(productId);
        if (!product) {
          setError('복사할 상품을 찾을 수 없습니다.');
          return;
        }
        
        setOriginalProduct(product);
      } catch (error) {
        console.error('상품 로드 실패:', error);
        setError('상품을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // 상품 복사 실행
  const handleCopyProduct = async () => {
    if (!originalProduct) return;

    try {
      setCopying(true);
      setError(null);

      console.log('🔄 상품 복사 시작:', originalProduct.name);
      
      const newProductId = await copyProduct(originalProduct.id);
      
      console.log('✅ 복사 완료, 편집 페이지로 이동:', newProductId);
      
      // 복사 완료 후 편집 페이지로 이동
      router.push(`/admin/manage/${newProductId}/edit?copied=true`);
    } catch (error) {
      console.error('상품 복사 실패:', error);
      setError((error as Error).message);
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !originalProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">오류 발생</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link
            href="/admin/manage"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>관리 페이지로 돌아가기</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center space-x-2">
                  <Copy className="w-6 h-6" />
                  <span>상품 복사</span>
                </h1>
                <p className="text-muted-foreground">기존 상품을 복사하여 새 상품을 생성합니다</p>
              </div>
            </div>
            <Link 
              href="/admin/manage"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              관리 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {originalProduct && (
          <div className="max-w-4xl mx-auto">
            {/* 원본 상품 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border rounded-lg p-6 mb-8"
            >
              <h2 className="text-lg font-semibold mb-4">복사할 상품</h2>
              <div className="flex items-start space-x-4">
                {originalProduct.images[0] && (
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={originalProduct.images[0]}
                      alt={originalProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{originalProduct.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">브랜드:</span>
                      <span className="ml-2 text-muted-foreground">{originalProduct.brand}</span>
                    </div>
                    <div>
                      <span className="font-medium">카테고리:</span>
                      <span className="ml-2 text-muted-foreground">{originalProduct.category}</span>
                    </div>
                    <div>
                      <span className="font-medium">가격:</span>
                      <span className="ml-2 text-muted-foreground">
                        {originalProduct.salePrice.toLocaleString()}원
                        {originalProduct.originalPrice !== originalProduct.salePrice && (
                          <span className="line-through ml-2 opacity-60">
                            {originalProduct.originalPrice.toLocaleString()}원
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">재고:</span>
                      <span className="ml-2 text-muted-foreground">{originalProduct.stock}개</span>
                    </div>
                    <div>
                      <span className="font-medium">상품 옵션:</span>
                      <span className="ml-2 text-muted-foreground">
                        {originalProduct.hasOptions ? 
                          `${originalProduct.options?.length || 0}개 옵션` : 
                          '옵션 없음'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">이미지:</span>
                      <span className="ml-2 text-muted-foreground">{originalProduct.images.length}개</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 복사 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            >
              <h2 className="text-lg font-semibold mb-4 text-blue-800">복사될 내용</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>상품명이 "<strong>{originalProduct.name} (복사)</strong>"로 변경됩니다</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>모든 상품 정보, 설명, 사양이 복사됩니다</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>상품 옵션과 옵션값이 새로운 ID로 복사됩니다</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>이미지 URL이 그대로 복사됩니다</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>조회수, 좋아요는 0으로 초기화됩니다</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>연관 상품은 제외되며 추천 상품에서 해제됩니다</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>복사 후 편집 페이지로 이동하여 수정할 수 있습니다</span>
                </div>
              </div>
            </motion.div>

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            {/* 복사 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-4"
            >
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                취소
              </button>
              
              <button
                onClick={handleCopyProduct}
                disabled={copying}
                className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>복사 중...</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>상품 복사하기</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}