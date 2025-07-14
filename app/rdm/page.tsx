'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Headphones, MessageCircle, Phone, Clock, Users, Star } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function RdmPage() {
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
            RDM
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            Real-time Design Matching - 실시간 디자인 상담 서비스
          </motion.p>
        </div>
      </section>

      {/* Service Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-light mb-4">전문가와 실시간 상담</h2>
                <p className="text-muted-foreground text-lg">
                  가구 선택에 고민이 있으신가요? 경험 많은 인테리어 전문가들이 
                  실시간으로 여러분의 공간에 맞는 완벽한 가구를 추천해드립니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">실시간 채팅</h3>
                    <p className="text-sm text-muted-foreground">
                      즉시 전문가와 연결되어 궁금한 점을 바로 해결하세요.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">음성 상담</h3>
                    <p className="text-sm text-muted-foreground">
                      더 자세한 상담이 필요하다면 전화 상담도 가능합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">전문가 매칭</h3>
                    <p className="text-sm text-muted-foreground">
                      분야별 전문가가 고객의 니즈에 맞춰 매칭됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">맞춤 추천</h3>
                    <p className="text-sm text-muted-foreground">
                      공간, 예산, 취향을 고려한 개인 맞춤 상품을 추천합니다.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light mb-4">상담 시작하기</h3>
                <p className="text-muted-foreground">
                  전문가와의 상담을 통해 완벽한 가구를 찾아보세요
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">실시간 채팅 상담</h4>
                    <div className="flex items-center space-x-1 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-xs">온라인</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    지금 바로 전문가와 채팅을 시작하세요
                  </p>
                  <Link 
                    href="/ai-chat"
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={16} />
                    <span>채팅 시작하기</span>
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">전화 상담 예약</h4>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span className="text-xs text-muted-foreground">09:00-18:00</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    더 자세한 상담이 필요하시다면 전화 예약을 이용하세요
                  </p>
                  <button className="w-full border border-primary text-primary py-3 px-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center space-x-2">
                    <Phone size={16} />
                    <span>상담 예약하기</span>
                  </button>
                </div>

                <div className="text-center pt-4">
                  <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>전문가 24명</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="fill-current text-yellow-500" />
                      <span>평점 4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-light mb-12">RDM의 장점</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-4">전문성</h3>
              <p className="text-muted-foreground">
                10년 이상 경력의 인테리어 전문가들이 직접 상담을 진행합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-4">신속성</h3>
              <p className="text-muted-foreground">
                평균 대기시간 30초, 빠르고 정확한 상담 서비스를 제공합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-4">만족도</h3>
              <p className="text-muted-foreground">
                고객 만족도 98%, 신뢰할 수 있는 전문가 상담을 경험하세요.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 