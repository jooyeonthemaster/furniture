'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag, User, ChevronDown, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownOpen) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userDropdownOpen]);

  const handleDropdownEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const megaMenuData = {
    '상품': {
      categories: [
        {
          title: '거실',
          items: ['소파', '테이블', 'TV장', '수납장', '사이드테이블']
        },
        {
          title: '침실',
          items: ['침대', '매트리스', '화장대', '협탁', '옷장']
        },
        {
          title: '주방/식당',
          items: ['식탁', '의자', '수납장', '바스툴', '와인장']
        },
        {
          title: '서재',
          items: ['책상', '의자', '책장', '서랍장', '파일링캐비닛']
        },
        {
          title: '조명',
          items: ['펜던트', '플로어램프', '테이블램프', '벽등', 'LED조명']
        },
        {
          title: '액세서리',
          items: ['쿠션', '러그', '소품', '아트워크', '화분']
        }
      ],
      featured: [
        { title: '모델하우스 컬렉션', image: '/modelhouse.jpg' },
        { title: '전시회 특가', image: '/exhibition.jpg' }
      ]
    },
    '브랜드': {
      categories: [
        {
          title: '럭셔리 브랜드',
          items: ['B&B Italia', 'Cassina', 'Poliform', 'Minotti', 'Flexform']
        },
        {
          title: '모던 브랜드',
          items: ['Herman Miller', 'Vitra', 'Knoll', 'Hay', 'Muuto']
        },
        {
          title: '한국 브랜드',
          items: ['일룸', '한샘', '리바트', '현대리바트', '퍼시스']
        }
      ],
      featured: [
        { title: '브랜드 스토리', image: '/hero.jpg' },
        { title: '신규 입점 브랜드', image: '/exhibition.jpg' }
      ]
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm border-b' : 'bg-background'
      }`}>
        <div className="container mx-auto px-4 xs:px-4">
          <div className="flex items-center justify-between h-16 xs:h-14">
            {/* Logo */}
            <Link href="/" className="text-xl xs:text-lg font-light tracking-widest">
              LUXE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm tracking-wide hover:opacity-70 transition-opacity">
                메인
              </Link>
              <Link href="/best" className="text-sm tracking-wide hover:opacity-70 transition-opacity">
                베스트
              </Link>
              <Link href="/special" className="text-sm tracking-wide hover:opacity-70 transition-opacity">
                기획전
              </Link>
              
              {/* 상품 드롭다운 */}
              <div 
                className="relative"
                onMouseEnter={() => handleDropdownEnter('상품')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center space-x-1 text-sm tracking-wide hover:opacity-70 transition-opacity">
                  <span>상품</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activeDropdown === '상품' && (
                  <div 
                    className="absolute top-full left-0 w-screen max-w-5xl bg-background border shadow-lg mt-1 p-8"
                    onMouseEnter={() => handleDropdownEnter('상품')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="grid grid-cols-6 gap-6">
                      {megaMenuData.상품.categories.map((category, index) => (
                        <div key={index}>
                          <h3 className="font-medium mb-3 text-sm tracking-wide">{category.title}</h3>
                          <ul className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link href={`/products/${item}`} className="text-xs opacity-70 hover:opacity-100">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        {megaMenuData.상품.featured.map((featured, index) => (
                          <Link key={index} href="/featured" className="flex items-center space-x-3 hover:opacity-70">
                            <div className="w-12 h-12 relative">
                              <Image 
                                src={featured.image} 
                                alt={featured.title}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <span className="text-sm">{featured.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 브랜드 드롭다운 */}
              <div 
                className="relative"
                onMouseEnter={() => handleDropdownEnter('브랜드')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center space-x-1 text-sm tracking-wide hover:opacity-70 transition-opacity">
                  <span>브랜드</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activeDropdown === '브랜드' && (
                  <div 
                    className="absolute top-full left-0 w-screen max-w-3xl bg-background border shadow-lg mt-1 p-8"
                    onMouseEnter={() => handleDropdownEnter('브랜드')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="grid grid-cols-3 gap-8">
                      {megaMenuData.브랜드.categories.map((category, index) => (
                        <div key={index}>
                          <h3 className="font-medium mb-3 text-sm tracking-wide">{category.title}</h3>
                          <ul className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link href={`/brands/${item}`} className="text-xs opacity-70 hover:opacity-100">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        {megaMenuData.브랜드.featured.map((featured, index) => (
                          <Link key={index} href="/brands" className="flex items-center space-x-3 hover:opacity-70">
                            <div className="w-12 h-12 relative">
                              <Image 
                                src={featured.image} 
                                alt={featured.title}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <span className="text-sm">{featured.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/ai-chat" className="text-sm tracking-wide hover:opacity-70 transition-opacity">
                AI 채팅
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 xs:space-x-3">
              <button className="hover:opacity-70 transition-opacity">
                <Search className="w-5 h-5 xs:w-4 xs:h-4" />
              </button>
              
              {user ? (
                // 로그인된 사용자 메뉴
                <>
                  <Link href="/cart" className="hover:opacity-70 transition-opacity">
                    <ShoppingBag className="w-5 h-5 xs:w-4 xs:h-4" />
                  </Link>
                  
                  {/* 사용자 드롭다운 */}
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-2 hover:opacity-70 transition-opacity"
                    >
                      <User className="w-5 h-5 xs:w-4 xs:h-4" />
                      <span className="hidden md:block text-sm">{user.name}</span>
                      <ChevronDown className="w-3 h-3 hidden md:block" />
                    </button>
                    
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {user.role === 'customer' ? '고객' : user.role === 'dealer' ? '딜러' : '관리자'}
                          </p>
                        </div>
                        <Link 
                          href="/mypage" 
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          마이페이지
                        </Link>
                        {user.role === 'dealer' && (
                          <Link 
                            href="/dealer/dashboard" 
                            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            딜러 대시보드
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link 
                            href="/admin/dashboard" 
                            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            관리자 대시보드
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>로그아웃</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // 비로그인 사용자 메뉴
                <>
                  <Link href="/cart" className="hover:opacity-70 transition-opacity">
                    <ShoppingBag className="w-5 h-5 xs:w-4 xs:h-4" />
                  </Link>
                  <Link href="/register" className="hidden md:block text-sm tracking-wide hover:opacity-70 transition-opacity px-4 py-2 border border-foreground hover:bg-foreground hover:text-background transition-all duration-300">
                    회원가입
                  </Link>
                </>
              )}
              
              <button 
                className="md:hidden hover:opacity-70 transition-opacity"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5 xs:w-4 xs:h-4" /> : <Menu className="w-5 h-5 xs:w-4 xs:h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ x: isMenuOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 right-0 w-full xs:w-full bg-background z-40 md:hidden"
      >
        <div className="flex flex-col p-8 xs:p-6 pt-24 xs:pt-20">
          <Link href="/" className="text-2xl xs:text-xl font-light mb-6 xs:mb-4">
            메인
          </Link>
          <Link href="/best" className="text-2xl xs:text-xl font-light mb-6 xs:mb-4">
            베스트
          </Link>
          <Link href="/special" className="text-2xl xs:text-xl font-light mb-6 xs:mb-4">
            기획전
          </Link>
          <Link href="/products" className="text-2xl xs:text-xl font-light mb-6 xs:mb-4">
            상품
          </Link>
          <Link href="/brands" className="text-2xl xs:text-xl font-light mb-6 xs:mb-4">
            브랜드
          </Link>
          <Link href="/ai-chat" className="text-2xl xs:text-xl font-light mb-6 xs:mb-4">
            AI 채팅
          </Link>
          <Link href="/mypage" className="text-2xl xs:text-xl font-light mb-6 xs:mb-4">
            마이페이지
          </Link>
          <div className="mt-8 xs:mt-6 pt-8 xs:pt-6 border-t">
            <Link href="/register" className="text-lg xs:text-base tracking-wide opacity-70 mb-4 block">
              회원가입
            </Link>
            <Link href="/dealer/register" className="text-sm tracking-wide opacity-70">
              딜러 등록하기
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
} 