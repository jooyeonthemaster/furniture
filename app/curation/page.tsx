'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, Clock, User, ArrowRight, Palette } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

// 큐레이션 목업 데이터
const curations = [
  {
    id: 1,
    title: '모던 미니멀 거실 만들기',
    subtitle: '단순함 속의 완벽함',
    description: '불필요한 것들을 덜어내고 진정 필요한 것들만 남긴 모던 미니멀 거실 스타일링 가이드',
    curator: '김민수 큐레이터',
    curatorTitle: '인테리어 전문가',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    category: '거실',
    tags: ['미니멀', '모던', '심플'],
    readTime: '5분',
    views: 1247,
    likes: 89,
    featured: true,
    products: [
      {
        name: 'Herman Miller Aeron Chair',
        price: 925000,
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&q=80'
      },
      {
        name: 'B&B Italia Sofa',
        price: 2100000,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'
      }
    ],
    content: `모던 미니멀 거실은 '덜어내는 것'에서 시작합니다. 필수적인 가구들만 선택하고, 각각의 가구가 공간에서 제 역할을 충실히 할 수 있도록 배치하는 것이 핵심입니다.

색상은 화이트, 그레이, 블랙의 무채색을 기본으로 하되, 포인트 컬러는 최대 한 가지만 사용하세요. 소재는 가죽, 금속, 유리 등 매끄럽고 깔끔한 질감의 소재를 선택하는 것이 좋습니다.`,
    publishedAt: '2024-01-15'
  },
  {
    id: 2,
    title: '스칸디나비아 스타일 침실',
    subtitle: '북유럽의 따뜻한 감성',
    description: '자연 소재와 밝은 색감으로 만드는 편안하고 아늑한 스칸디나비아 스타일 침실',
    curator: '박지영 큐레이터',
    curatorTitle: '라이프스타일 디자이너',
    image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
    category: '침실',
    tags: ['스칸디나비아', '자연', '아늑함'],
    readTime: '7분',
    views: 892,
    likes: 67,
    featured: true,
    products: [
      {
        name: 'Oak Wood Bed Frame',
        price: 850000,
        image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&q=80'
      },
      {
        name: 'Wool Throw Blanket',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&q=80'
      }
    ],
    content: `스칸디나비아 스타일의 핵심은 자연스러움과 실용성입니다. 오크, 파인, 자작나무 등의 밝은 원목 가구를 중심으로 하고, 린넨, 울, 코튼 등의 자연 소재 텍스타일을 활용하세요.

색상은 화이트를 베이스로 하되, 베이지, 그레이 등의 뉴트럴 톤과 함께 사용합니다. 식물을 활용한 그린 포인트도 스칸디나비아 스타일의 특징입니다.`,
    publishedAt: '2024-01-12'
  },
  {
    id: 3,
    title: '프렌치 시크 다이닝룸',
    subtitle: '파리지엔의 우아함',
    description: '클래식과 모던이 조화된 프렌치 시크 스타일로 연출하는 세련된 다이닝룸',
    curator: '이소영 큐레이터',
    curatorTitle: '프렌치 인테리어 전문가',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    category: '다이닝',
    tags: ['프렌치', '클래식', '우아함'],
    readTime: '6분',
    views: 654,
    likes: 45,
    featured: false,
    products: [
      {
        name: 'French Dining Table',
        price: 1500000,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'
      },
      {
        name: 'Vintage Chandelier',
        price: 680000,
        image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80'
      }
    ],
    content: `프렌치 시크 스타일은 과도하지 않은 우아함이 특징입니다. 앤틱 가구와 모던한 액세서리의 조화, 부드러운 곡선과 직선의 균형을 추구하세요.

색상은 크림, 베이지, 소프트 그레이를 기본으로 하고, 골드나 브론즈 액센트를 포인트로 활용합니다. 벨벳, 실크 등의 고급스러운 소재도 프렌치 시크의 핵심 요소입니다.`,
    publishedAt: '2024-01-10'
  },
  {
    id: 4,
    title: '인더스트리얼 홈오피스',
    subtitle: '도시적 감성의 작업 공간',
    description: '콘크리트와 철재의 조화로 만드는 세련되고 집중력 높은 홈오피스 공간',
    curator: '정태현 큐레이터',
    curatorTitle: '공간 디자이너',
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&q=80',
    category: '홈오피스',
    tags: ['인더스트리얼', '도시적', '모던'],
    readTime: '4분',
    views: 423,
    likes: 31,
    featured: false,
    products: [
      {
        name: 'Industrial Desk',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&q=80'
      },
      {
        name: 'Metal Bookshelf',
        price: 320000,
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&q=80'
      }
    ],
    content: `인더스트리얼 스타일의 홈오피스는 기능성과 스타일을 동시에 추구합니다. 철재와 원목의 조합, 노출된 구조물, 콘크리트 질감 등이 특징적입니다.

조명은 트랙 조명이나 펜던트 조명을 활용하여 작업에 필요한 충분한 조도를 확보하되, 공간의 분위기도 살릴 수 있도록 배치합니다.`,
    publishedAt: '2024-01-08'
  },
  {
    id: 5,
    title: '보헤미안 리빙룸',
    subtitle: '자유로운 영혼의 공간',
    description: '다양한 패턴과 컬러, 자연 소재로 만드는 개성 넘치는 보헤미안 스타일 리빙룸',
    curator: '최은지 큐레이터',
    curatorTitle: '보헤미안 스타일 전문가',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    category: '거실',
    tags: ['보헤미안', '자유로운', '컬러풀'],
    readTime: '8분',
    views: 567,
    likes: 42,
    featured: false,
    products: [
      {
        name: 'Rattan Lounge Chair',
        price: 380000,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'
      },
      {
        name: 'Moroccan Rug',
        price: 240000,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'
      }
    ],
    content: `보헤미안 스타일은 규칙에 얽매이지 않는 자유로운 표현이 핵심입니다. 다양한 패턴의 텍스타일, 자연 소재의 가구, 여행에서 수집한 소품들을 자유롭게 믹스 매치하세요.

색상은 어스 톤을 베이스로 하되, 터콰이즈, 오렌지, 딥 레드 등의 비비드한 컬러를 포인트로 활용합니다. 식물과 캔들, 태피스트리 등도 보헤미안 무드를 완성하는 중요한 요소입니다.`,
    publishedAt: '2024-01-05'
  }
];

const categories = ['전체', '거실', '침실', '다이닝', '홈오피스', '키친'];

export default function CurationPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredCurations = curations.filter(curation => 
    selectedCategory === '전체' || curation.category === selectedCategory
  );

  const featuredCurations = curations.filter(c => c.featured);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center">
              <Palette className="w-8 h-8 text-background" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            Curation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            전문 큐레이터가 제안하는 라이프스타일별 인테리어 가이드
          </motion.p>

          {/* 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12"
          >
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">{curations.length}</div>
              <div className="text-sm opacity-60">큐레이션</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">5</div>
              <div className="text-sm opacity-60">전문 큐레이터</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">
                {curations.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
              </div>
              <div className="text-sm opacity-60">총 조회수</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Curations */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">추천 큐레이션</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredCurations.slice(0, 2).map((curation, index) => (
              <motion.div
                key={curation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/curation/${curation.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                    <Image
                      src={curation.image}
                      alt={curation.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    
                    {/* 카테고리 배지 */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {curation.category}
                      </span>
                    </div>

                    {/* 내용 */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl xs:text-xl font-light mb-2">{curation.title}</h3>
                      <p className="text-lg xs:text-base opacity-90 mb-3">{curation.subtitle}</p>
                      
                      {/* 메타 정보 */}
                      <div className="flex items-center justify-between text-sm opacity-80">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{curation.curator}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{curation.readTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{curation.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{curation.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 호버 효과 */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white text-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2">
                        <span>자세히 보기</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 border-t border-b">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-muted'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Curations Grid */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">모든 큐레이션</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCurations.map((curation, index) => (
              <motion.div
                key={curation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/curation/${curation.id}`} className="block">
                  <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-foreground">
                    {/* 이미지 */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={curation.image}
                        alt={curation.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                          {curation.category}
                        </span>
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{curation.curator}</span>
                        <span>{curation.readTime}</span>
                      </div>

                      <h3 className="font-medium text-lg leading-tight group-hover:opacity-70 transition-opacity">
                        {curation.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground">
                        {curation.subtitle}
                      </p>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {curation.description}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1">
                        {curation.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* 메타 정보 */}
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{curation.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>{curation.likes}</span>
                            </div>
                          </div>
                          <span>{new Date(curation.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl xs:text-2xl font-light mb-4">
              새로운 큐레이션을 놓치지 마세요
            </h2>
            <p className="text-lg xs:text-base opacity-70 mb-8">
              전문 큐레이터의 최신 인테리어 가이드와 팁을 이메일로 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-foreground"
              />
              <button className="bg-foreground text-background px-6 py-3 rounded font-medium hover:bg-foreground/90 transition-colors">
                구독하기
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}