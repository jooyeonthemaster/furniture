'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Tag, ArrowRight, Zap, Gift, Flame } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const events = [
  {
    id: 1,
    title: '모델하우스 특가 세일',
    subtitle: '프리미엄 가구 최대 85% 할인',
    description: '전국 모델하우스에서 나온 A급 가구들을 특별한 가격에 만나보세요. 한정 수량, 놓치면 후회하는 기회입니다.',
    image: '/modelhouse.jpg',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    discount: 85,
    products: 156,
    status: 'active',
    type: 'sale',
    featured: true,
    tags: ['모델하우스', '할인', '한정수량']
  },
  {
    id: 2,
    title: '전시회 가구 컬렉션',
    subtitle: '디자인 위크 프리미엄 셀렉션',
    description: '밀라노 디자인 위크, 쾰른 가구박람회 등에서 전시된 명품 가구들을 합리적인 가격에 제공합니다.',
    image: '/exhibition.jpg',
    startDate: '2024-01-20',
    endDate: '2024-03-20',
    discount: 70,
    products: 89,
    status: 'active',
    type: 'exhibition',
    featured: true,
    tags: ['전시회', '디자인위크', '명품']
  },
  {
    id: 3,
    title: '조명 페스티벌',
    subtitle: '분위기를 바꾸는 디자이너 조명',
    description: '톰 딕슨, 포스카리니, 루이스 폴센 등 세계적인 브랜드의 조명으로 공간의 분위기를 완전히 바꿔보세요.',
    image: '/LIGHTING.jpg',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    discount: 50,
    products: 67,
    status: 'upcoming',
    type: 'category',
    featured: false,
    tags: ['조명', '분위기', '브랜드']
  },
  {
    id: 4,
    title: '프리미엄 시팅 위크',
    subtitle: '앉는 순간 다른 의자들',
    description: '허먼밀러, 비트라, 카시나의 명작 의자들을 특별가로 만나보세요. 에르고노믹부터 디자인 클래식까지.',
    image: '/SEATING.jpg',
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    discount: 60,
    products: 134,
    status: 'upcoming',
    type: 'category',
    featured: true,
    tags: ['의자', '에르고노믹', '클래식']
  },
  {
    id: 5,
    title: '스토리지 솔루션',
    subtitle: '정리의 완성, 수납의 예술',
    description: '폴리폼, 스트링 등의 모듈러 수납 시스템으로 공간을 효율적이고 아름답게 정리하세요.',
    image: '/STORAGE.jpg',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    discount: 40,
    products: 78,
    status: 'upcoming',
    type: 'category',
    featured: false,
    tags: ['수납', '모듈러', '정리']
  },
  {
    id: 6,
    title: '얼리버드 스프링 세일',
    subtitle: '봄맞이 인테리어 리뉴얼',
    description: '새로운 시즌을 맞아 집안 분위기를 바꿔보세요. 전 카테고리 상품 할인과 무료배송 혜택까지.',
    image: '/hero.jpg',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    discount: 30,
    products: 245,
    status: 'upcoming',
    type: 'seasonal',
    featured: false,
    tags: ['봄', '리뉴얼', '전체할인']
  }
];

const filters = {
  status: ['전체', '진행중', '예정', '종료'],
  type: ['전체', '할인', '전시회', '카테고리', '시즌']
};

const typeConfig = {
  sale: { label: '특가세일', color: 'bg-red-500', icon: Tag },
  exhibition: { label: '전시회', color: 'bg-purple-500', icon: Star },
  category: { label: '카테고리', color: 'bg-blue-500', icon: Zap },
  seasonal: { label: '시즌', color: 'bg-green-500', icon: Gift }
};

export default function SpecialPage() {
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');

  const filteredEvents = events.filter(event => {
    const statusMatch = selectedStatus === '전체' || 
      (selectedStatus === '진행중' && event.status === 'active') ||
      (selectedStatus === '예정' && event.status === 'upcoming') ||
      (selectedStatus === '종료' && event.status === 'ended');
    
    const typeMatch = selectedType === '전체' || 
      (selectedType === '할인' && event.type === 'sale') ||
      (selectedType === '전시회' && event.type === 'exhibition') ||
      (selectedType === '카테고리' && event.type === 'category') ||
      (selectedType === '시즌' && event.type === 'seasonal');
    
    return statusMatch && typeMatch;
  });

  const featuredEvents = events.filter(event => event.featured);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">진행중</span>;
      case 'upcoming':
        return <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">예정</span>;
      case 'ended':
        return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">종료</span>;
      default:
        return null;
    }
  };

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
              <Flame className="w-8 h-8 text-background" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            기획전
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            특별한 기회, 특별한 할인. 놓치면 후회하는 한정 이벤트
          </motion.p>

          {/* 현재 진행중인 이벤트 카운트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12"
          >
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">
                {events.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm opacity-60">진행중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">85%</div>
              <div className="text-sm opacity-60">최대 할인</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">
                {events.reduce((sum, e) => sum + e.products, 0).toLocaleString()}
              </div>
              <div className="text-sm opacity-60">특가 상품</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">주요 기획전</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredEvents.slice(0, 2).map((event, index) => {
              const config = typeConfig[event.type as keyof typeof typeConfig];
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/special/${event.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      
                      {/* 상태 및 타입 배지 */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {getStatusBadge(event.status)}
                        <div className={`${config.color} text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1`}>
                          <IconComponent className="w-3 h-3" />
                          <span>{config.label}</span>
                        </div>
                      </div>

                      {/* 할인율 */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-xl font-bold">
                          {event.discount}%
                        </div>
                      </div>

                      {/* 내용 */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-2xl xs:text-xl font-light mb-2">{event.title}</h3>
                        <p className="text-lg xs:text-base opacity-90 mb-3">{event.subtitle}</p>
                        <div className="flex items-center space-x-4 text-sm opacity-80">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(event.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>{event.products}개 상품</span>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-t border-b">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* 상태 필터 */}
            <div className="flex items-center space-x-4 overflow-x-auto">
              <span className="text-sm font-medium whitespace-nowrap">상태:</span>
              {filters.status.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`
                    whitespace-nowrap px-3 py-1 text-sm transition-all duration-200
                    ${selectedStatus === status
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* 타입 필터 */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-border bg-background text-foreground rounded focus:outline-none focus:border-foreground"
            >
              {filters.type.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* All Events Grid */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">모든 기획전</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => {
              const config = typeConfig[event.type as keyof typeof typeConfig];
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/special/${event.id}`} className="block">
                    <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-foreground">
                      {/* 이미지 */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          {getStatusBadge(event.status)}
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {event.discount}% OFF
                          </div>
                        </div>
                      </div>

                      {/* 내용 */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`${config.color} text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1`}>
                            <IconComponent className="w-3 h-3" />
                            <span>{config.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {event.products}개 상품
                          </span>
                        </div>

                        <h3 className="font-medium text-lg leading-tight group-hover:opacity-70 transition-opacity">
                          {event.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground">
                          {event.subtitle}
                        </p>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {event.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(event.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(event.endDate).toLocaleDateString()}까지</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
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
              특가 소식을 놓치지 마세요
            </h2>
            <p className="text-lg xs:text-base opacity-70 mb-8">
              새로운 기획전과 특별 할인 소식을 가장 먼저 받아보세요
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