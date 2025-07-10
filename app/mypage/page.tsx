'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Package, Heart, Clock, Star, ChevronRight, Settings, CreditCard, MapPin, Bell } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const menuItems = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'orders', label: '주문내역', icon: Package },
  { id: 'wishlist', label: '찜목록', icon: Heart },
  { id: 'reviews', label: '리뷰', icon: Star },
  { id: 'addresses', label: '배송지', icon: MapPin },
  { id: 'payments', label: '결제수단', icon: CreditCard },
  { id: 'notifications', label: '알림설정', icon: Bell },
  { id: 'settings', label: '설정', icon: Settings }
];

const recentOrders = [
  {
    id: 'ORD-001',
    date: '2024-12-15',
    status: '배송완료',
    items: [
      {
        name: 'Herman Miller Aeron 의자',
        image: '/SEATING.jpg',
        price: 567000,
        quantity: 1
      }
    ],
    total: 567000
  },
  {
    id: 'ORD-002',
    date: '2024-12-10',
    status: '배송중',
    items: [
      {
        name: 'B&B Italia Charles 소파',
        image: '/hero.jpg',
        price: 1350000,
        quantity: 1
      }
    ],
    total: 1350000
  }
];

const wishlistItems = [
  {
    id: 1,
    name: 'Cassina LC4 샤롱',
    brand: 'Cassina',
    image: '/LIGHTING.jpg',
    originalPrice: 3200000,
    salePrice: 800000,
    discount: 75
  },
  {
    id: 2,
    name: 'Minotti Hamilton 소파',
    brand: 'Minotti',
    image: '/exhibition.jpg',
    originalPrice: 5600000,
    salePrice: 840000,
    discount: 85
  }
];

const userStats = [
  { label: '총 주문', value: '12회', icon: Package },
  { label: '총 구매금액', value: '8,450,000원', icon: CreditCard },
  { label: '적립 포인트', value: '84,500P', icon: Star },
  { label: '등급', value: 'VIP', icon: User }
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <User className="w-12 h-12 opacity-60" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">홍길동님</h3>
                <p className="text-sm opacity-60 mb-2">hong@example.com</p>
                <div className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                    VIP 회원
                  </span>
                  <span className="text-xs opacity-60">다음 등급까지 1,550,000원</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-60" />
                  <div className="text-lg font-medium">{stat.value}</div>
                  <div className="text-sm opacity-60">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-6">
              <h4 className="font-medium mb-4">개인정보</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">이름</span>
                  <span className="text-sm">홍길동</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">이메일</span>
                  <span className="text-sm">hong@example.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">휴대폰</span>
                  <span className="text-sm">010-1234-5678</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">가입일</span>
                  <span className="text-sm">2024.01.15</span>
                </div>
              </div>
              <button className="w-full mt-6 py-2 border border-foreground hover:bg-foreground hover:text-background transition-all duration-300 text-sm">
                정보 수정
              </button>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">주문내역</h3>
              <select className="px-3 py-2 border rounded-lg text-sm">
                <option>최근 3개월</option>
                <option>최근 6개월</option>
                <option>최근 1년</option>
              </select>
            </div>
            
            {recentOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{order.id}</span>
                      <span className="text-sm opacity-60">{order.date}</span>
                    </div>
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === '배송완료' ? 'bg-green-100 text-green-800' :
                      order.status === '배송중' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-60" />
                </div>
                
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm opacity-60">수량: {item.quantity}개</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.price.toLocaleString()}원</div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-medium">총 결제금액</span>
                  <span className="text-lg font-medium">{order.total.toLocaleString()}원</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'wishlist':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">찜목록</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex space-x-4">
                    <div className="w-24 h-24 bg-muted rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs opacity-60 mb-1">{item.brand}</div>
                      <h4 className="font-medium text-sm mb-2">{item.name}</h4>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-medium">{item.salePrice.toLocaleString()}원</span>
                        <span className="text-xs opacity-60 line-through">{item.originalPrice.toLocaleString()}원</span>
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">{item.discount}%</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 bg-foreground text-background text-xs rounded hover:opacity-90">
                          장바구니
                        </button>
                        <button className="px-3 py-2 border text-xs rounded hover:bg-muted">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">내 리뷰</h3>
            
            <div className="text-center py-16">
              <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg opacity-70 mb-4">아직 작성한 리뷰가 없습니다</p>
              <p className="text-sm opacity-60 mb-6">
                구매한 상품에 대한 리뷰를 작성하고 포인트를 받아보세요
              </p>
              <Link href="/orders" className="inline-block px-6 py-2 border border-foreground hover:bg-foreground hover:text-background transition-all duration-300 text-sm">
                주문내역 보기
              </Link>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-70">준비 중입니다</p>
          </div>
        );
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            마이페이지
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70"
          >
            계정 정보와 주문 내역을 관리하세요
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="border rounded-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 opacity-60" />
                  </div>
                  <h3 className="font-medium">홍길동님</h3>
                  <p className="text-sm opacity-60">VIP 회원</p>
                </div>
                
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-foreground text-background'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-3/4">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-background border rounded-lg p-8"
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl xs:text-xl font-light mb-8">빠른 메뉴</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link href="/products" className="group p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
              <Package className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-medium mb-1">상품 둘러보기</div>
              <div className="text-sm opacity-60">새로운 상품 찾기</div>
            </Link>
            
            <Link href="/best" className="group p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
              <Star className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-medium mb-1">베스트 상품</div>
              <div className="text-sm opacity-60">인기 상품 보기</div>
            </Link>
            
            <Link href="/special" className="group p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
              <Clock className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-medium mb-1">기획전</div>
              <div className="text-sm opacity-60">특별한 혜택</div>
            </Link>
            
            <Link href="/ai-chat" className="group p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
              <Bell className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-medium mb-1">AI 상담</div>
              <div className="text-sm opacity-60">궁금한 점 문의</div>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 