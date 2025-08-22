'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Award, ExternalLink } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

// 디자이너 목업 데이터
const designers = [
  {
    id: 1,
    name: 'Charles Eames',
    koreanName: '찰스 임스',
    period: '1907-1978',
    nationality: '미국',
    specialty: '가구 디자인, 건축',
    description: '20세기 가장 영향력 있는 디자이너 중 한 명으로, 아내 레이 임스와 함께 혁신적인 가구를 디자인했습니다.',
    bio: '찰스 임스는 미국의 디자이너이자 건축가로, 특히 가구 디자인 분야에서 혁신을 이끌었습니다. 그의 작품은 기능성과 아름다움을 완벽하게 조화시켰으며, 현재까지도 전 세계에서 사랑받고 있습니다.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    works: ['Eames Lounge Chair', 'DSW Chair', 'Molded Plywood Chair'],
    awards: ['AIA Gold Medal', 'Royal Gold Medal'],
    brands: ['Herman Miller', 'Vitra'],
    featured: true,
    tags: ['모던', '플라이우드', '혁신']
  },
  {
    id: 2,
    name: 'Le Corbusier',
    koreanName: '르 코르뷔지에',
    period: '1887-1965',
    nationality: '스위스-프랑스',
    specialty: '건축, 가구 디자인, 도시 계획',
    description: '모던 건축의 아버지로 불리며, 기능주의적 가구 디자인의 선구자입니다.',
    bio: '르 코르뷔지에는 20세기 건축과 디자인에 혁명을 가져온 거장입니다. 그의 가구는 건축적 사고를 바탕으로 한 기하학적 형태와 기능성을 특징으로 합니다.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    works: ['LC2 Armchair', 'LC4 Chaise Lounge', 'LC6 Table'],
    awards: ['Pritzker Prize', 'AIA Gold Medal'],
    brands: ['Cassina', 'Alias'],
    featured: true,
    tags: ['모더니즘', '기능주의', '건축적']
  },
  {
    id: 3,
    name: 'Philippe Starck',
    koreanName: '필리프 스타크',
    period: '1949-현재',
    nationality: '프랑스',
    specialty: '제품 디자인, 인테리어',
    description: '독창적이고 도발적인 디자인으로 유명한 현대 디자인의 아이콘입니다.',
    bio: '필리프 스타크는 프랑스의 세계적인 디자이너로, 가구부터 건축까지 다양한 분야에서 혁신적인 작품을 선보이고 있습니다. 그의 디자인은 유머와 기능성을 동시에 추구합니다.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    works: ['Ghost Chair', 'Masters Chair', 'Gun Lamp'],
    awards: ['Red Dot Award', 'Good Design Award'],
    brands: ['Kartell', 'Driade', 'Alessi'],
    featured: true,
    tags: ['투명', '혁신적', '유머러스']
  },
  {
    id: 4,
    name: 'Arne Jacobsen',
    koreanName: '아르네 야콥센',
    period: '1902-1971',
    nationality: '덴마크',
    specialty: '건축, 가구 디자인',
    description: '덴마크 디자인의 거장으로, 스칸디나비아 모던 스타일을 대표하는 디자이너입니다.',
    bio: '아르네 야콥센은 덴마크의 건축가이자 디자이너로, 스칸디나비아 디자인의 황금기를 이끈 인물입니다. 그의 작품은 단순함과 우아함의 완벽한 조화를 보여줍니다.',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80',
    works: ['Ant Chair', 'Swan Chair', 'Egg Chair'],
    awards: ['Eckersberg Medal', 'C.F. Hansen Medal'],
    brands: ['Fritz Hansen', 'Arne Jacobsen'],
    featured: true,
    tags: ['스칸디나비아', '유기적', '미니멀']
  },
  {
    id: 5,
    name: 'Patricia Urquiola',
    koreanName: '파트리시아 우르키올라',
    period: '1961-현재',
    nationality: '스페인-이탈리아',
    specialty: '가구 디자인, 인테리어',
    description: '현대 여성 디자이너의 대표주자로, 감성적이고 혁신적인 디자인을 선보입니다.',
    bio: '파트리시아 우르키올라는 스페인 태생의 이탈리아 디자이너로, 현대 디자인계에서 가장 영향력 있는 여성 디자이너 중 한 명입니다. 그녀의 작품은 감성과 기술의 완벽한 결합을 보여줍니다.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    works: ['Fjord Chair', 'Tropicalia Chair', 'Antibodi Chaise'],
    awards: ['Designer of the Year', 'Good Design Award'],
    brands: ['Moroso', 'B&B Italia', 'Kartell'],
    featured: false,
    tags: ['감성적', '혁신적', '여성적']
  },
  {
    id: 6,
    name: 'Tom Dixon',
    koreanName: '톰 딕슨',
    period: '1959-현재',
    nationality: '영국',
    specialty: '조명 디자인, 가구',
    description: '영국의 대표적인 산업 디자이너로, 독특한 소재와 형태의 조명으로 유명합니다.',
    bio: '톰 딕슨은 영국의 산업 디자이너로, 특히 조명 디자인 분야에서 혁신적인 작품을 선보이고 있습니다. 그의 작품은 산업적 미학과 장인정신의 조화를 보여줍니다.',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80',
    works: ['Beat Light', 'Copper Shade', 'Melt Light'],
    awards: ['OBE', 'Designer of the Year'],
    brands: ['Tom Dixon', 'Habitat'],
    featured: false,
    tags: ['산업적', '구리', '조명']
  }
];

const categories = ['전체', '클래식', '모던', '컨템포러리', '스칸디나비아'];

export default function DesignersPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = designer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designer.koreanName.includes(searchTerm) ||
                         designer.description.includes(searchTerm);
    
    const matchesCategory = selectedCategory === '전체' || 
                           designer.tags.some(tag => 
                             (selectedCategory === '클래식' && ['모더니즘', '건축적'].includes(tag)) ||
                             (selectedCategory === '모던' && ['모던', '혁신적'].includes(tag)) ||
                             (selectedCategory === '컨템포러리' && ['혁신적', '감성적'].includes(tag)) ||
                             (selectedCategory === '스칸디나비아' && ['스칸디나비아', '미니멀'].includes(tag))
                           );
    
    return matchesSearch && matchesCategory;
  });

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
              <Award className="w-8 h-8 text-background" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            Designers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            세계적인 디자이너들의 철학과 작품을 만나보세요
          </motion.p>

          {/* 검색 및 필터 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mt-12 space-y-6"
          >
            {/* 검색바 */}
            <div className="relative">
              <input
                type="text"
                placeholder="디자이너 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-foreground text-center"
              />
            </div>

            {/* 카테고리 필터 */}
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
          </motion.div>
        </div>
      </section>

      {/* Featured Designers */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">주요 디자이너</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {designers.filter(d => d.featured).slice(0, 4).map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* 이미지 */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={designer.image}
                      alt={designer.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-medium mb-1">{designer.koreanName}</h3>
                      <p className="text-sm opacity-90">{designer.name}</p>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{designer.period}</span>
                      </div>
                      <span>{designer.nationality}</span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {designer.description}
                    </p>

                    {/* 대표작 */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">대표작</h4>
                      <div className="flex flex-wrap gap-1">
                        {designer.works.slice(0, 3).map((work) => (
                          <span key={work} className="text-xs bg-muted px-2 py-1 rounded">
                            {work}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 협력 브랜드 */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">협력 브랜드</h4>
                      <div className="flex flex-wrap gap-1">
                        {designer.brands.map((brand) => (
                          <span key={brand} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                      {designer.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Designers Grid */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">모든 디자이너</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigners.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:border-foreground">
                  {/* 프로필 이미지 */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={designer.image}
                      alt={designer.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {designer.featured && (
                      <div className="absolute top-3 right-3">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="p-4 space-y-3">
                    <div className="text-center">
                      <h3 className="font-medium text-lg leading-tight group-hover:opacity-70 transition-opacity">
                        {designer.koreanName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{designer.name}</p>
                      <p className="text-xs text-muted-foreground">{designer.period}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">{designer.specialty}</p>
                    </div>

                    {/* 대표작 (간단히) */}
                    <div className="text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {designer.works.slice(0, 2).map((work) => (
                          <span key={work} className="text-xs bg-muted px-2 py-1 rounded">
                            {work}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDesigners.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg opacity-60">검색 조건에 맞는 디자이너가 없습니다.</p>
              <p className="text-sm opacity-40 mt-2">다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl xs:text-2xl font-light mb-4">
              디자이너 가구를 만나보세요
            </h2>
            <p className="text-lg xs:text-base opacity-70 mb-8">
              세계적인 디자이너들의 작품을 쓸만한 가에서 특별한 가격에 만나보실 수 있습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/brands"
                className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium"
              >
                브랜드 둘러보기
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition-colors font-medium"
              >
                상품 보러가기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}