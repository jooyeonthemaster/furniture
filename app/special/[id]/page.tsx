'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft, Star, Zap, Gift, Flame } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

// 기획전 데이터 (실제로는 API에서 가져올 데이터)
const events = [
  {
    id: 1,
    title: '모델하우스 특가 세일',
    subtitle: '프리미엄 가구 최대 85% 할인',
    description: '전국 모델하우스에서 나온 A급 가구들을 특별한 가격에 만나보세요. 한정 수량, 놓치면 후회하는 기회입니다.',
    detailDescription: `전국 주요 건설사의 모델하우스에서 사용된 프리미엄 가구들을 특별한 가격에 만나보실 수 있는 기회입니다. 
    
모든 가구는 전문가의 엄격한 검수를 거쳐 A급 품질만을 선별했으며, 브랜드 정품 보증서와 함께 제공됩니다. 

이번 기획전에서는 Herman Miller, B&B Italia, Poliform 등 세계적인 브랜드의 가구들을 최대 85% 할인된 가격으로 만나보실 수 있습니다.`,
    image: '/modelhouse.jpg',
    images: ['/modelhouse.jpg', '/hero.jpg', '/exhibition.jpg'],
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    discount: 85,
    products: 156,
    status: 'active',
    type: 'sale',
    featured: true,
    tags: ['모델하우스', '할인', '한정수량'],
    benefits: [
      '최대 85% 할인 혜택',
      '전국 무료배송',
      '전문 설치 서비스',
      'A급 품질 보증',
      '브랜드 정품 보증서 제공'
    ],
    terms: [
      '기획전 기간: 2024년 1월 15일 ~ 2월 15일',
      '재고 한정으로 조기 품절될 수 있습니다',
      '일부 상품은 추가 할인이 제한될 수 있습니다',
      '배송 및 설치 일정은 별도 협의'
    ]
  },
  {
    id: 2,
    title: '전시회 가구 컬렉션',
    subtitle: '디자인 위크 프리미엄 셀렉션',
    description: '밀라노 디자인 위크, 쾰른 가구박람회 등에서 전시된 명품 가구들을 합리적인 가격에 제공합니다.',
    detailDescription: `세계 3대 가구박람회인 밀라노 디자인 위크, 쾰른 가구박람회, 하이포인트 마켓에서 전시된 프리미엄 가구들을 특별히 선보입니다.

각 브랜드의 최신 트렌드와 혁신적인 디자인을 담은 가구들로, 전시회에서만 볼 수 있었던 특별한 작품들을 이제 여러분의 공간에서 만나보실 수 있습니다.

모든 전시품은 전문 큐레이터가 엄선한 디자인 명작들로, 단순한 가구를 넘어선 예술작품의 가치를 지니고 있습니다.`,
    image: '/exhibition.jpg',
    images: ['/exhibition.jpg', '/modelhouse.jpg', '/hero.jpg'],
    startDate: '2024-01-20',
    endDate: '2024-03-20',
    discount: 70,
    products: 89,
    status: 'active',
    type: 'exhibition',
    featured: true,
    tags: ['전시회', '디자인위크', '명품'],
    benefits: [
      '전시회 프리미엄 컬렉션',
      '큐레이터 엄선 디자인',
      '최대 70% 특가',
      '작품 스토리 제공',
      '한정판 컬렉션'
    ],
    terms: [
      '기획전 기간: 2024년 1월 20일 ~ 3월 20일',
      '전시품 특성상 교환/반품이 제한될 수 있습니다',
      '각 작품별 스토리북 제공',
      'VIP 고객 우선 예약 가능'
    ]
  }
  // 더 많은 이벤트들...
];

const typeConfig = {
  sale: { label: '특가세일', color: 'bg-red-500', icon: Tag },
  exhibition: { label: '전시회', color: 'bg-purple-500', icon: Star },
  category: { label: '카테고리', color: 'bg-blue-500', icon: Zap },
  seasonal: { label: '시즌', color: 'bg-green-500', icon: Gift }
};

export default function SpecialDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);
  const event = events.find(e => e.id === eventId);
  
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const products = await getAllProducts();
        // 기획전과 관련된 상품들을 랜덤하게 선택 (실제로는 기획전 ID로 필터링)
        const shuffled = products.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 8));
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [eventId]);

  if (!event) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-light mb-4">기획전을 찾을 수 없습니다</h1>
            <p className="text-muted-foreground mb-8">요청하신 기획전이 존재하지 않거나 종료되었습니다.</p>
            <Link 
              href="/special" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              기획전 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const config = typeConfig[event.type as keyof typeof typeConfig];
  const IconComponent = config.icon;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium">진행중</span>;
      case 'upcoming':
        return <span className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium">예정</span>;
      case 'ended':
        return <span className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium">종료</span>;
      default:
        return null;
    }
  };

  const isActive = event.status === 'active';
  const daysLeft = Math.ceil((new Date(event.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <PageLayout>
      {/* 뒤로가기 버튼 */}
      <div className="container mx-auto px-4 pt-8">
        <Link 
          href="/special"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>기획전 목록으로</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 텍스트 콘텐츠 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 배지들 */}
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(event.status)}
                  <div className={`${config.color} text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2`}>
                    <IconComponent className="w-4 h-4" />
                    <span>{config.label}</span>
                  </div>
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold">
                    최대 {event.discount}% OFF
                  </div>
                </div>

                {/* 제목 및 설명 */}
                <div>
                  <h1 className="text-4xl xs:text-3xl md:text-5xl font-light mb-4">
                    {event.title}
                  </h1>
                  <p className="text-xl xs:text-lg opacity-80 mb-6">
                    {event.subtitle}
                  </p>
                  <p className="text-lg xs:text-base opacity-70 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* 기간 및 상품 수 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm opacity-60">기간</div>
                      <div className="font-medium">
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm opacity-60">상품 수</div>
                      <div className="font-medium">{event.products.toLocaleString()}개</div>
                    </div>
                  </div>
                </div>

                {/* 남은 시간 */}
                {isActive && daysLeft > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-red-700">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">
                        {daysLeft}일 남음 - 놓치면 후회하는 기회!
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA 버튼 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/products?event=${eventId}`}
                    className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium"
                  >
                    기획전 상품 보기
                  </Link>
                  <button className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition-colors font-medium">
                    알림 신청
                  </button>
                </div>
              </motion.div>
            </div>

            {/* 이미지 갤러리 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* 메인 이미지 */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* 추가 이미지들 */}
              {event.images && event.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {event.images.slice(1, 4).map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`${event.title} ${index + 2}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 상세 설명 */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* 상세 설명 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-light mb-6">기획전 소개</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {event.detailDescription}
                </p>
              </div>
            </motion.div>

            {/* 혜택 및 조건 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* 혜택 */}
              <div>
                <h3 className="text-xl font-medium mb-4">특별 혜택</h3>
                <ul className="space-y-2">
                  {event.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 이용 조건 */}
              <div>
                <h3 className="text-xl font-medium mb-4">이용 조건</h3>
                <ul className="space-y-2">
                  {event.terms.map((term, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                      <span className="text-sm opacity-70">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 관련 상품 */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl xs:text-2xl font-light mb-4">기획전 상품</h2>
            <p className="text-muted-foreground">
              이번 기획전에서 만나볼 수 있는 특별한 상품들
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-gray-50 mb-3">
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* 기획전 특가 뱃지 */}
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        기획전 {event.discount}% OFF
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      <div className="flex items-end justify-between pt-1">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400 line-through">
                            ₩{product.originalPrice.toLocaleString()}
                          </div>
                          <div className="font-semibold text-gray-900">
                            ₩{Math.round(product.salePrice * (1 - event.discount / 100)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* 더보기 버튼 */}
          <div className="text-center mt-12">
            <Link
              href={`/products?event=${eventId}`}
              className="inline-flex items-center px-8 py-3 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition-colors"
            >
              기획전 상품 전체보기 ({event.products}개)
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
