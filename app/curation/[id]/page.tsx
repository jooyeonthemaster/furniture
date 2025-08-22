'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Eye, Heart, Clock, User, Share2, Bookmark } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

// 큐레이션 상세 데이터
const curationDetails = {
  1: {
    id: 1,
    title: '모던 미니멀 거실 만들기',
    subtitle: '단순함 속의 완벽함',
    description: '불필요한 것들을 덜어내고 진정 필요한 것들만 남긴 모던 미니멀 거실 스타일링 가이드',
    curator: '김민수 큐레이터',
    curatorTitle: '인테리어 전문가',
    curatorBio: '15년간 고급 주택 인테리어를 전문으로 하며, 미니멀 디자인의 대가로 인정받고 있습니다.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    category: '거실',
    tags: ['미니멀', '모던', '심플'],
    readTime: '5분',
    views: 1247,
    likes: 89,
    publishedAt: '2024-01-15',
    content: `
# 모던 미니멀 거실의 핵심 원칙

모던 미니멀 거실은 '덜어내는 것'에서 시작합니다. 필수적인 가구들만 선택하고, 각각의 가구가 공간에서 제 역할을 충실히 할 수 있도록 배치하는 것이 핵심입니다.

## 색상 선택의 기준

색상은 화이트, 그레이, 블랙의 무채색을 기본으로 하되, 포인트 컬러는 최대 한 가지만 사용하세요. 너무 많은 색상은 미니멀의 본질을 해칩니다.

### 추천 색상 조합:
- **베이스**: 화이트 + 라이트 그레이
- **포인트**: 딥 네이비 또는 차콜 그레이
- **액센트**: 내추럴 우드 톤

## 소재와 질감

소재는 가죽, 금속, 유리 등 매끄럽고 깔끔한 질감의 소재를 선택하는 것이 좋습니다. 각 소재가 가진 고유한 특성을 살려 공간에 깊이를 더할 수 있습니다.

## 가구 배치의 원칙

1. **중심점 만들기**: 거실의 중심이 되는 포인트를 설정하세요
2. **동선 확보**: 사람이 움직이는 공간을 충분히 확보하세요
3. **시각적 균형**: 가구의 높낮이와 크기의 균형을 맞추세요

모던 미니멀 스타일은 단순히 가구를 적게 두는 것이 아닙니다. 각 요소가 의미를 가지고, 전체적인 조화를 이루는 것이 진정한 미니멀리즘입니다.
    `,
    products: [
      {
        id: 'curation-1-1',
        name: 'Minimal Sofa 미니멀 소파',
        brand: 'B&B Italia',
        price: 2100000,
        originalPrice: 2800000,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
        description: '깔끔한 라인과 편안함을 모두 갖춘 미니멀 소파'
      },
      {
        id: 'curation-1-2',
        name: 'Glass Coffee Table 유리 커피테이블',
        brand: 'Cassina',
        price: 850000,
        originalPrice: 1200000,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
        description: '투명한 유리로 공간을 넓어 보이게 하는 커피테이블'
      },
      {
        id: 'curation-1-3',
        name: 'Minimal Floor Lamp 미니멀 플로어 램프',
        brand: 'Tom Dixon',
        price: 420000,
        originalPrice: 580000,
        image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80',
        description: '단순한 형태로 공간에 포인트를 주는 플로어 램프'
      }
    ]
  }
};

export default function CurationDetailPage() {
  const params = useParams();
  const curationId = parseInt(params.id as string);
  const curation = curationDetails[curationId as keyof typeof curationDetails];

  if (!curation) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-light mb-4">큐레이션을 찾을 수 없습니다</h1>
            <p className="text-muted-foreground mb-8">요청하신 큐레이션이 존재하지 않습니다.</p>
            <Link 
              href="/curation" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              큐레이션 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* 뒤로가기 */}
      <div className="container mx-auto px-4 pt-8">
        <Link 
          href="/curation"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>큐레이션 목록으로</span>
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
                {/* 카테고리 배지 */}
                <div className="flex items-center space-x-3">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {curation.category}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{curation.readTime}</span>
                  </div>
                </div>

                {/* 제목 */}
                <div>
                  <h1 className="text-4xl xs:text-3xl md:text-5xl font-light mb-4">
                    {curation.title}
                  </h1>
                  <p className="text-xl xs:text-lg opacity-80 mb-6">
                    {curation.subtitle}
                  </p>
                  <p className="text-lg xs:text-base opacity-70 leading-relaxed">
                    {curation.description}
                  </p>
                </div>

                {/* 큐레이터 정보 */}
                <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
                  <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="font-medium">{curation.curator}</h3>
                    <p className="text-sm text-muted-foreground">{curation.curatorTitle}</p>
                    <p className="text-xs text-muted-foreground mt-1">{curation.curatorBio}</p>
                  </div>
                </div>

                {/* 통계 및 액션 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{curation.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{curation.likes}</span>
                    </div>
                    <span>{new Date(curation.publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 메인 이미지 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src={curation.image}
                alt={curation.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="whitespace-pre-line text-base leading-relaxed">
              {curation.content}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">추천 상품</h2>
          <p className="text-center text-muted-foreground mb-12">
            이 스타일링에 사용된 상품들을 쓸만한 가에서 만나보세요
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {curation.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {product.brand}
                        </p>
                        <h3 className="font-medium leading-tight group-hover:opacity-70 transition-opacity">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.description}
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400 line-through">
                            ₩{product.originalPrice.toLocaleString()}
                          </div>
                          <div className="font-semibold text-gray-900">
                            ₩{product.price.toLocaleString()}
                          </div>
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

      {/* Related Curations */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">관련 큐레이션</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                id: 2,
                title: '스칸디나비아 스타일 침실',
                subtitle: '북유럽의 따뜻한 감성',
                image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&q=80',
                curator: '박지영 큐레이터',
                readTime: '7분'
              },
              {
                id: 3,
                title: '프렌치 시크 다이닝룸',
                subtitle: '파리지엔의 우아함',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
                curator: '이소영 큐레이터',
                readTime: '6분'
              }
            ].map((related, index) => (
              <motion.div
                key={related.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/curation/${related.id}`} className="block">
                  <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1 group-hover:opacity-70 transition-opacity">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {related.subtitle}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{related.curator}</span>
                        <span>{related.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
