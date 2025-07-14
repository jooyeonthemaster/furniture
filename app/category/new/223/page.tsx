'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Grid3X3, List, Sparkles } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

export default function NewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // 최신 상품들 (생성일 기준 최신순)
        const newProducts = allProducts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 20); // 최신 20개만
        setProducts(newProducts);
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
            <Sparkles className="w-16 h-16 text-primary" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 font-serif"
          >
            New Arrivals
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            새롭게 입고된 프리미엄 가구들을 가장 먼저 만나보세요
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">새로운 상품 {products.length}개</span>
            </div>

            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg opacity-60">아직 새로운 상품이 없습니다.</p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
              }
            `}>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    group cursor-pointer relative
                    ${viewMode === 'list' ? 'flex space-x-6 p-6 border rounded-lg' : ''}
                  `}
                >
                  {/* NEW 배지 */}
                  <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </div>
                  
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