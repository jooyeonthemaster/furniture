'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Star, Eye, Heart } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const curationPosts = [
  {
    id: 1,
    title: '2024 밀라노 디자인 위크 하이라이트',
    excerpt: '세계 최대 디자인 박람회에서 발견한 올해의 가구 트렌드를 소개합니다.',
    image: '/exhibition.jpg',
    author: '에디터 김지수',
    date: '2024-12-15',
    views: 1250,
    likes: 89,
    category: '월간디자이너'
  },
  {
    id: 2,
    title: '작은 공간을 위한 스마트 가구 5선',
    excerpt: '원룸, 투룸에서도 충분히 활용할 수 있는 공간 절약형 가구들을 엄선했습니다.',
    image: '/STORAGE .jpg',
    author: '에디터 박민준',
    date: '2024-12-10',
    views: 890,
    likes: 67,
    category: '키워드'
  },
  {
    id: 3,
    title: '겨울철 따뜻한 리빙룸 만들기',
    excerpt: '추운 겨울, 집에서 보내는 시간이 늘어나는 요즘 따뜻하고 포근한 공간 연출법',
    image: '/LIGHTING.jpg',
    author: '에디터 이서연',
    date: '2024-12-05',
    views: 1580,
    likes: 123,
    category: '#오늘의루밍'
  },
  {
    id: 4,
    title: '럭셔리 브랜드 가구 할인 이벤트 총정리',
    excerpt: '연말 특가! 카시나, 비앤비이탈리아 등 명품 브랜드 할인 정보',
    image: '/hero.jpg',
    author: '에디터 최현우',
    date: '2024-12-01',
    views: 2100,
    likes: 156,
    category: '이벤트'
  },
  {
    id: 5,
    title: '신혼집 꾸미기 완벽 가이드',
    excerpt: '새로운 시작을 위한 공간, 신혼집 인테리어 노하우를 전문가가 알려드립니다.',
    image: '/modelhouse.jpg',
    author: '에디터 김지수',
    date: '2024-11-28',
    views: 1890,
    likes: 134,
    category: '#루밍집들이'
  },
  {
    id: 6,
    title: '2025년 가구 트렌드 전망',
    excerpt: '내년 가구 업계를 이끌어갈 주요 트렌드와 컬러, 소재를 미리 살펴봅니다.',
    image: '/SEATING.jpg',
    author: '에디터 박민준',
    date: '2024-11-25',
    views: 1456,
    likes: 98,
    category: '월간디자이너'
  }
];

const categories = ['전체', '월간디자이너', '이벤트', '키워드', '#오늘의루밍', '#루밍집들이'];

export default function CurationPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 font-serif"
          >
            Curation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            디자인 전문가들이 엄선한 인사이트와 트렌드를 만나보세요
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-6 py-2 text-sm font-medium border rounded-full hover:bg-foreground hover:text-background transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden mb-16"
          >
            <div className="aspect-[16/9] md:aspect-[21/9] relative">
              <Image
                src={curationPosts[0].image}
                alt={curationPosts[0].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-primary px-3 py-1 rounded-full text-sm font-medium">
                    {curationPosts[0].category}
                  </span>
                  <span className="text-sm opacity-80">{curationPosts[0].date}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-light mb-3">
                  {curationPosts[0].title}
                </h2>
                <p className="text-lg opacity-90 mb-4 max-w-3xl">
                  {curationPosts[0].excerpt}
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span className="text-sm">{curationPosts[0].author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye size={16} />
                    <span className="text-sm">{curationPosts[0].views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart size={16} />
                    <span className="text-sm">{curationPosts[0].likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curationPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/curation/${post.id}`}>
                  <div className="aspect-[4/3] relative overflow-hidden rounded-lg mb-4">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-secondary text-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-medium group-hover:text-foreground/80 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <User size={14} />
                        <span className="text-xs text-muted-foreground">{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 