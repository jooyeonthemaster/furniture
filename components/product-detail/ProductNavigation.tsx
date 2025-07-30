'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Product } from '@/types';

interface ProductNavigationProps {
  product: Product;
}

export default function ProductNavigation({ product }: ProductNavigationProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => router.back()}
            className="group inline-flex items-center space-x-3 px-4 py-2 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-muted hover:border-border hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="p-1 rounded-lg bg-muted group-hover:bg-background transition-colors"
              whileHover={{ x: -2 }}
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              이전 페이지로
            </span>
          </motion.button>
          
          {/* 브레드크럼 추가 */}
          <nav className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">홈</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors">상품</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          {/* 상품 간단 정보 */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium line-clamp-1">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </div>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.images[0] || '/placeholder-image.jpg'}
                alt={product.name}
                fill
                quality={90}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}