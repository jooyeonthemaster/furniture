'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getPrimaryImageUrl } from '@/utils';
import Link from 'next/link';
import { Percent } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // 할인된 상품들만 필터링
        const saleProducts = allProducts.filter(product => 
          product.originalPrice && product.originalPrice > product.salePrice
        );
        setProducts(saleProducts);
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
            <p>상품을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-red-50 to-background">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center mb-6"
          >
            <Percent className="w-16 h-16 text-red-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 font-serif text-red-600"
          >
            Sale
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            특별한 가격으로 만나는 프리미엄 디자인 제품들
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg opacity-60">현재 진행 중인 세일이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-[4/5] mb-3 relative overflow-hidden rounded-lg bg-gray-50">
                      <Image
                        src={getPrimaryImageUrl(product as any)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Sale Badge */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        {product.originalPrice && Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
                      </div>

                      {/* 상태 뱃지 */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full text-white shadow-sm ${
                          product.condition === 'new' ? 'bg-emerald-500' :
                          product.condition === 'like-new' ? 'bg-blue-500' :
                          product.condition === 'excellent' ? 'bg-amber-500' :
                          product.condition === 'good' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}>
                          {product.condition === 'new' ? '신품' :
                           product.condition === 'like-new' ? 'A급' :
                           product.condition === 'excellent' ? 'B급' :
                           product.condition === 'good' ? 'C급' : 'D급'}
                        </span>
                      </div>

                      {/* 재고 부족 오버레이 */}
                      {(product.availability !== 'in_stock' || product.stock <= 0) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium text-sm bg-black/70 px-3 py-1 rounded">품절</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {/* 브랜드 */}
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {product.brand}
                      </p>
                      
                      {/* 상품명 - 텍스트 크기 축소 및 줄 높이 조정 */}
                      <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      
                      {/* 가격 및 재고 정보 */}
                      <div className="flex items-end justify-between pt-1">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400 line-through">
                            ₩{product.originalPrice?.toLocaleString()}
                          </div>
                          <div className="font-semibold text-red-600">
                            ₩{product.salePrice.toLocaleString()}
                          </div>
                        </div>
                        
                        {/* 재고 및 평점 */}
                        <div className="text-right space-y-1">
                          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            product.availability === 'in_stock' && product.stock > 0
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {product.availability === 'in_stock' && product.stock > 0 
                              ? `재고 ${product.stock}` 
                              : '품절'
                            }
                          </div>
                          
                          {/* 평점 표시 */}
                          {product.rating && (
                            <div className="text-xs text-gray-400 flex items-center justify-end space-x-1">
                              <span>⭐</span>
                              <span>{product.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
} 