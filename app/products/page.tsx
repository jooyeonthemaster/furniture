'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Grid3X3, List, Star, Heart, ArrowUpDown,
  MapPin, Calendar, Package, Truck, Eye, TrendingUp, ChevronDown,
  Sliders, X, CheckCircle, Clock, Users
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedBrand, setSelectedBrand] = useState('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // 실제 Firebase 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = [...products];

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 브랜드 필터
    if (selectedBrand !== '전체') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedBrand]);

  // 유니크한 카테고리와 브랜드 추출
  const categories = ['전체', ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ['전체', ...Array.from(new Set(products.map(p => p.brand)))];

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
      {/* 헤더 섹션 */}
      <section className="py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl xs:text-3xl font-light mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            프리미엄 가구 컬렉션
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            모델하우스와 전시회에서 엄선된 명품 가구들을 특별한 가격에 만나보세요
          </motion.p>
        </div>
      </section>

      {/* 검색 및 필터 섹션 */}
      <section className="py-6 px-4 border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색바 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="상품명, 브랜드로 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
              />
            </div>

            {/* 컨트롤 버튼들 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>필터</span>
              </button>

              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 필터 패널 */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-muted rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">카테고리</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">브랜드</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 상품 목록 */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {/* 결과 수 */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              총 {filteredProducts.length}개의 상품이 있습니다
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">검색된 상품이 없습니다</h3>
              <p className="text-muted-foreground">다른 검색어를 시도해보세요</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 
              'space-y-4'
            }>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={viewMode === 'grid' ? 
                    'group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300' :
                    'flex bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300'
                  }
                >
                  {/* 상품 이미지 */}
                  <div className={viewMode === 'grid' ? 'relative aspect-square' : 'relative w-48 h-48 flex-shrink-0'}>
                    <Image
                      src={product.images[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% 할인
                      </span>
                    </div>
                  </div>

                  {/* 상품 정보 */}
                  <div className="p-4 flex-1">
                    <div className="mb-2">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg font-bold text-red-600">
                          {product.salePrice.toLocaleString()}원
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString()}원
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{product.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{product.likes}</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        재고 {product.stock}개
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full bg-primary text-primary-foreground text-center py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      상세보기
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
} 