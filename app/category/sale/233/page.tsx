'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer relative"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Sale Badge */}
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-sm px-2 py-1 rounded font-medium">
                        {product.originalPrice && Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2 group-hover:text-foreground/80 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.brand}
                      </p>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground line-through">
                          ₩{product.originalPrice?.toLocaleString()}
                        </div>
                        <div className="font-semibold text-lg text-red-600">
                          ₩{product.salePrice.toLocaleString()}
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