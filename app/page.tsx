'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getFeaturedProducts, getAllProducts } from '@/lib/products';
import { Product } from '@/types';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const heroSlides = [
    {
      id: 1,
      brand: 'Herman Miller',
      discount: '최대 70%',
      title: '아이코닉 오피스 가구',
      description: '세계적인 디자이너들이 만든 혁신적인 오피스 가구',
      image: '/hero.jpg',
      link: '/brands/herman-miller'
    },
    {
      id: 2,
      brand: 'B&B Italia',
      discount: '최대 80%',
      title: '이탈리안 럭셔리',
      description: '현대적이고 세련된 이탈리아 명품 가구',
      image: '/modelhouse.jpg',
      link: '/brands/bb-italia'
    },
    {
      id: 3,
      brand: 'Cassina',
      discount: '최대 75%',
      title: '모던 클래식',
      description: '시대를 초월한 디자인의 이탈리아 명품',
      image: '/exhibition.jpg',
      link: '/brands/cassina'
    },
    {
      id: 4,
      brand: 'Poliform',
      discount: '최대 65%',
      title: '컨템포러리 엘레간스',
      description: '현대적 우아함을 담은 프리미엄 가구',
      image: '/SEATING.jpg',
      link: '/brands/poliform'
    },
    {
      id: 5,
      brand: 'Minotti',
      discount: '최대 85%',
      title: '이탈리안 마에스트로',
      description: '장인정신이 깃든 최고급 수제 가구',
      image: '/LIGHTING.jpg',
      link: '/brands/minotti'
    }
  ];

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // 실제 상품 데이터 로드
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await getAllProducts();
        setFeaturedProducts(products.slice(0, 6)); // 최신 6개 상품만 표시
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const categories = [
    { name: '거실', count: 156, image: '/SEATING.jpg' },
    { name: '침실', count: 89, image: '/hero.jpg' },
    { name: '주방/식당', count: 124, image: '/STORAGE.jpg' },
    { name: '서재', count: 78, image: '/exhibition.jpg' },
    { name: '조명', count: 203, image: '/LIGHTING.jpg' },
    { name: '액세서리', count: 92, image: '/modelhouse.jpg' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden pt-16 xs:pt-14">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 xs:px-4 text-white">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl xs:max-w-full"
            >
              <div className="mb-4 xs:mb-3">
                <span className="inline-block bg-red-600 text-white px-4 py-2 xs:px-3 xs:py-1 text-sm xs:text-xs font-bold rounded-lg">
                  {heroSlides[currentSlide].discount}
                </span>
              </div>
              
              <div className="mb-6 xs:mb-4">
                <h2 className="text-sm xs:text-xs tracking-widest opacity-80 mb-2">
                  {heroSlides[currentSlide].brand}
                </h2>
                <h1 className="text-6xl xs:text-3xl md:text-7xl font-light leading-tight mb-4">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xl xs:text-base opacity-90 leading-relaxed max-w-lg xs:max-w-full">
                  {heroSlides[currentSlide].description}
                </p>
              </div>

              <div className="flex items-center space-x-4 xs:space-x-3">
                <Link 
                  href={heroSlides[currentSlide].link}
                  className="inline-flex items-center space-x-2 bg-white text-black px-8 py-3 xs:px-6 xs:py-2 hover:bg-white/90 transition-all duration-300 group"
                >
                  <span className="text-sm xs:text-xs tracking-wide">제품 보기</span>
                  <ArrowRight className="w-4 h-4 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link 
                  href="/special"
                  className="inline-flex items-center space-x-2 border border-white text-white px-8 py-3 xs:px-6 xs:py-2 hover:bg-white hover:text-black transition-all duration-300"
                >
                  <span className="text-sm xs:text-xs tracking-wide">기획전 보기</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 xs:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 xs:space-x-4">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 xs:w-10 xs:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 xs:w-4 xs:h-4 text-white" />
          </button>
          
          <div className="flex items-center space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          
          <button 
            onClick={nextSlide}
            className="w-12 h-12 xs:w-10 xs:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 xs:w-4 xs:h-4 text-white" />
          </button>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 xs:py-16 px-4 xs:px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 xs:mb-12"
          >
            <h2 className="text-4xl xs:text-2xl font-light mb-4">공간별 쇼핑</h2>
            <p className="text-lg xs:text-base opacity-70">당신의 공간에 맞는 완벽한 가구를 찾아보세요</p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 xs:gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={`/categories/${category.name}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4 xs:mb-3">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-xl xs:text-lg font-light tracking-wider">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm xs:text-xs opacity-60">{category.count}개 상품</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 xs:py-16 px-4 xs:px-4 bg-secondary">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 xs:mb-12"
          >
            <h2 className="text-4xl xs:text-2xl font-light mb-4">베스트 셀러</h2>
            <p className="text-lg xs:text-base opacity-70">고객들이 가장 사랑하는 제품들</p>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xs:gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xs:gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-[3/4] bg-muted overflow-hidden rounded-lg mb-4 xs:mb-3">
                        <img
                          src={require('@/utils').getPrimaryImageUrl(product)}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 xs:top-3 left-4 xs:left-3">
                          <span className="bg-red-600 text-white px-2 py-1 xs:px-1.5 xs:py-0.5 text-xs font-bold rounded">
                            {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 xs:space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs xs:text-xs opacity-60">{product.brand}</span>
                          <span className="text-xs xs:text-xs bg-green-100 text-green-700 px-2 py-1 rounded">재고 {product.stock}개</span>
                        </div>
                        <h3 className="font-medium text-sm xs:text-xs leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg xs:text-base font-light">{product.salePrice.toLocaleString()}원</span>
                            <span className="text-sm xs:text-xs opacity-60 line-through">{product.originalPrice.toLocaleString()}원</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">등록된 상품이 없습니다.</p>
                  <Link href="/admin/manage/add" className="text-primary hover:underline text-sm mt-2 inline-block">
                    첫 상품을 등록해보세요
                  </Link>
                </div>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16 xs:mt-12"
          >
            <Link 
              href="/best"
              className="inline-flex items-center space-x-2 border border-foreground px-8 py-3 xs:px-6 xs:py-2 hover:bg-foreground hover:text-background transition-all duration-300 group"
            >
              <span className="text-sm xs:text-xs tracking-wide">베스트 상품 더보기</span>
              <ArrowRight className="w-4 h-4 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 xs:py-16 px-4 xs:px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl xs:text-2xl font-light mb-4">뉴스레터 구독</h2>
            <p className="text-lg xs:text-base opacity-70 mb-8 xs:mb-6">
              새로운 상품과 특별한 혜택을 가장 먼저 받아보세요
            </p>
            
            <div className="max-w-md xs:max-w-full mx-auto flex xs:flex-col xs:space-y-3">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 xs:w-full px-4 py-3 xs:py-2 border-0 border-b bg-transparent focus:outline-none focus:border-primary text-center xs:text-left"
              />
              <button className="px-8 py-3 xs:px-6 xs:py-2 bg-foreground text-background text-sm xs:text-xs tracking-wide hover:opacity-90 transition-opacity">
                구독하기
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
