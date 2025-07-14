'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Grid3X3, List, Lightbulb } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

export default function LightingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('인기순');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // 조명 관련 상품들 필터링
        const lightingProducts = allProducts.filter(product => 
          product.category === 'lighting' || 
          product.name.includes('조명') || 
          product.name.includes('램프') || 
          product.name.includes('라이트') ||
          product.name.includes('펜던트')
        );
        setProducts(lightingProducts);
        setFilteredProducts(lightingProducts);
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
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center mb-6"
          >
            <Lightbulb className="w-16 h-16 text-yellow-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 font-serif"
          >
            Lighting
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            공간의 분위기를 완성하는 디자이너 조명 컬렉션
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">조명 {filteredProducts.length}개</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-foreground text-background' : ''}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-foreground text-background' : ''}`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:border-foreground"
              >
                <option value="인기순">인기순</option>
                <option value="가격낮은순">가격 낮은순</option>
                <option value="가격높은순">가격 높은순</option>
                <option value="최신순">최신순</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg opacity-60">등록된 조명이 없습니다.</p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
              }
            `}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    group cursor-pointer
                    ${viewMode === 'list' ? 'flex space-x-6 p-6 border rounded-lg' : ''}
                  `}
                >
                  <Link href={`/products/${product.id}`}>
                    <div className={`
                      ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-square mb-4'}
                      relative overflow-hidden rounded-lg
                    `}>
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="font-medium mb-2 group-hover:text-foreground/80 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.brand}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {product.originalPrice && product.originalPrice > product.salePrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₩{product.originalPrice.toLocaleString()}
                            </div>
                          )}
                          <div className="font-semibold text-lg">
                            ₩{product.salePrice.toLocaleString()}
                          </div>
                        </div>
                        {product.originalPrice && product.originalPrice > product.salePrice && (
                          <div className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                            {Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
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