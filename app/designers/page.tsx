'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Calendar, MapPin, Star } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const designers = [
  {
    id: 1,
    name: 'Charles & Ray Eames',
    nationality: 'American',
    period: '1907-1978 / 1912-1988',
    description: '20세기 최고의 디자이너 부부로, 모던 가구 디자인의 혁신을 이끌었습니다.',
    image: '/exhibition.jpg',
    famousWorks: ['Eames Lounge Chair', 'DSW Chair', 'EA117'],
    awards: ['AIA Gold Medal', 'Royal Gold Medal'],
    category: 'Furniture Designer'
  },
  {
    id: 2,
    name: 'Le Corbusier',
    nationality: 'Swiss-French',
    period: '1887-1965',
    description: '건축가이자 가구 디자이너로, 모던 가구의 아버지라 불립니다.',
    image: '/hero.jpg',
    famousWorks: ['LC4 Chaise Lounge', 'LC2 Chair', 'LC3 Sofa'],
    awards: ['Pritzker Prize', 'AIA Gold Medal'],
    category: 'Architect & Designer'
  },
  {
    id: 3,
    name: 'Arne Jacobsen',
    nationality: 'Danish',
    period: '1902-1971',
    description: '덴마크 모던 디자인의 대표 주자로, 우아하고 기능적인 작품들을 남겼습니다.',
    image: '/SEATING.jpg',
    famousWorks: ['Egg Chair', 'Swan Chair', 'Series 7'],
    awards: ['Prince Eugen Medal', 'C.F. Hansen Medal'],
    category: 'Architect & Designer'
  },
  {
    id: 4,
    name: 'Philippe Starck',
    nationality: 'French',
    period: '1949-',
    description: '현대 디자인의 혁신가로, 기능과 예술성을 완벽하게 결합한 작품들로 유명합니다.',
    image: '/LIGHTING.jpg',
    famousWorks: ['Louis Ghost Chair', 'Masters Chair', 'Miss K Lamp'],
    awards: ['Compasso d\'Oro', 'Design for Asia Award'],
    category: 'Industrial Designer'
  },
  {
    id: 5,
    name: 'Tom Dixon',
    nationality: 'British',
    period: '1959-',
    description: '혁신적인 재료와 제조 기법을 통해 독창적인 디자인을 선보이는 영국의 디자이너입니다.',
    image: '/modelhouse.jpg',
    famousWorks: ['Beat Light', 'Melt Pendant', 'S Chair'],
    awards: ['OBE', 'Design Week Award'],
    category: 'Product Designer'
  },
  {
    id: 6,
    name: 'Patricia Urquiola',
    nationality: 'Spanish',
    period: '1961-',
    description: '스페인 출신의 세계적인 여성 디자이너로, 감성적이고 현대적인 디자인으로 사랑받습니다.',
    image: '/STORAGE .jpg',
    famousWorks: ['Antibodi Chair', 'Fjord Armchair', 'Tufty-Time Sofa'],
    awards: ['Designer of the Year', 'Wallpaper Design Award'],
    category: 'Furniture Designer'
  }
];

const categories = ['전체', 'Furniture Designer', 'Architect & Designer', 'Industrial Designer', 'Product Designer'];

export default function DesignersPage() {
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
            Designers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            시대를 초월한 작품을 남긴 위대한 디자이너들을 만나보세요
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

      {/* Designers Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designers.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/designers/${designer.id}`}>
                  <div className="aspect-[4/5] relative overflow-hidden rounded-lg mb-6">
                    <Image
                      src={designer.image}
                      alt={designer.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                        {designer.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium group-hover:text-foreground/80 transition-colors mb-1">
                        {designer.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{designer.nationality}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{designer.period}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {designer.description}
                    </p>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">대표작</h4>
                      <div className="flex flex-wrap gap-2">
                        {designer.famousWorks.slice(0, 3).map((work) => (
                          <span
                            key={work}
                            className="bg-secondary text-foreground px-2 py-1 rounded text-xs"
                          >
                            {work}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-1">
                        <Award size={14} />
                        <span className="text-xs text-muted-foreground">
                          {designer.awards.length}개 수상
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="fill-current text-yellow-500" />
                        <span className="text-xs text-muted-foreground">마스터</span>
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