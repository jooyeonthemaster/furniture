'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuEnter = (menuName: string) => {
    setActiveMenu(menuName);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
    setActiveSubMenu(null);
  };

  const handleSubMenuEnter = (subMenuName: string) => {
    setActiveSubMenu(subMenuName);
  };

  const handleSubMenuLeave = () => {
    setActiveSubMenu(null);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
        onMouseLeave={handleMenuLeave}
      >

        {/* 데스크톱 네비게이션 */}
        <div className="hidden lg:block">
          <div className="px-4 lg:px-8">
            <div className="flex items-center justify-between">
              
              {/* 왼쪽 메뉴들 */}
              <nav className="flex items-center">

                {/* 네비게이션 홈 로고 */}
                <Link href="/" className="mr-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="360" height="80" viewBox="0 0 360 80">
                    <text x="20" y="60" fontSize="72" fontFamily="serif" fill="black">SERQU</text>
                  </svg>
                </Link>

                {/* 메뉴들... (기존 메뉴 유지) */}
                <Link 
                  href="/category/new/223/" 
                  className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                >
                  New
                </Link>

                {/* Furniture 메뉴 */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('furniture')}
                >
                  <Link 
                    href="/category/furniture/224/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Furniture
                  </Link>

                  {/* 메가메뉴들... (기존 메가메뉴 모두 유지) */}
                  {activeMenu === 'furniture' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/furniture/224/" className="text-gray-600 hover:text-black">전체</Link></li>
                          <li 
                            className="relative"
                            onMouseEnter={() => handleSubMenuEnter('seating')}
                          >
                            <Link href="/category/시팅/2536/" className="text-gray-600 hover:text-black">시팅</Link>
                            
                            {activeSubMenu === 'seating' && (
                              <div 
                                className="absolute left-0 top-full mt-6 w-screen bg-white border-t shadow-lg z-[60]"
                                onMouseEnter={() => handleSubMenuEnter('seating')}
                                onMouseLeave={handleSubMenuLeave}
                              >
                                <div className="px-4 lg:px-8 py-4">
                                  <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                                    <li><Link href="/category/다이닝체어/2601/" className="text-gray-600 hover:text-black">다이닝 체어</Link></li>
                                    <li><Link href="/category/오피스체어/2602/" className="text-gray-600 hover:text-black">오피스 체어</Link></li>
                                    <li><Link href="/category/라운지체어오토만/2603/" className="text-gray-600 hover:text-black">라운지 체어/오토만</Link></li>
                                    <li><Link href="/category/락킹체어/2604/" className="text-gray-600 hover:text-black">락킹 체어</Link></li>
                                    <li><Link href="/category/소파/2605/" className="text-gray-600 hover:text-black">소파</Link></li>
                                    <li><Link href="/category/스툴/2606/" className="text-gray-600 hover:text-black">스툴</Link></li>
                                    <li><Link href="/category/바스툴/2607/" className="text-gray-600 hover:text-black">바스툴</Link></li>
                                    <li><Link href="/category/벤치/2608/" className="text-gray-600 hover:text-black">벤치</Link></li>
                                    <li><Link href="/category/키즈시팅/2609/" className="text-gray-600 hover:text-black">키즈 시팅</Link></li>
                                    <li><Link href="/category/아웃도어시팅/2610/" className="text-gray-600 hover:text-black">아웃도어 시팅</Link></li>
                                    <li><Link href="/category/시팅관련액세서리/2611/" className="text-gray-600 hover:text-black">시팅 관련 액세서리</Link></li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </li>
                          <li 
                            className="relative"
                            onMouseEnter={() => handleSubMenuEnter('table')}
                          >
                            <Link href="/category/테이블/2537/" className="text-gray-600 hover:text-black">테이블</Link>
                            
                            {activeSubMenu === 'table' && (
                              <div 
                                className="absolute left-0 top-full mt-6 w-screen bg-white border-t shadow-lg z-[60]"
                                onMouseEnter={() => handleSubMenuEnter('table')}
                                onMouseLeave={handleSubMenuLeave}
                              >
                                <div className="px-4 lg:px-8 py-4">
                                  <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                                    <li><Link href="/category/테이블/2537/" className="text-gray-600 hover:text-black">테이블</Link></li>
                                    <li><Link href="/category/다이닝테이블/2701/" className="text-gray-600 hover:text-black">다이닝 테이블</Link></li>
                                    <li><Link href="/category/데스크/2702/" className="text-gray-600 hover:text-black">데스크</Link></li>
                                    <li><Link href="/category/사이드커피테이블/2703/" className="text-gray-600 hover:text-black">사이드 & 커피 테이블</Link></li>
                                    <li><Link href="/category/키즈테이블/2704/" className="text-gray-600 hover:text-black">키즈 테이블</Link></li>
                                    <li><Link href="/category/아웃도어테이블/2705/" className="text-gray-600 hover:text-black">아웃도어 테이블</Link></li>
                                    <li><Link href="/category/테이블관련액세서리/2706/" className="text-gray-600 hover:text-black">테이블 관련 액세서리</Link></li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </li>
                          <li><Link href="/category/선반/2555/" className="text-gray-600 hover:text-black">선반</Link></li>
                          <li><Link href="/category/수납가구/2552/" className="text-gray-600 hover:text-black">수납가구</Link></li>
                          <li><Link href="/category/모듈가구/239/" className="text-gray-600 hover:text-black">모듈가구</Link></li>
                          <li><Link href="/category/트롤리/2559/" className="text-gray-600 hover:text-black">트롤리</Link></li>
                          <li><Link href="/category/베드/2539/" className="text-gray-600 hover:text-black">베드</Link></li>
                          <li><Link href="/category/행어코트랙/2558/" className="text-gray-600 hover:text-black">행어/코트랙</Link></li>
                          <li><Link href="/category/거울/3015/" className="text-gray-600 hover:text-black">거울</Link></li>
                          <li><Link href="/category/스크린/2842/" className="text-gray-600 hover:text-black">스크린</Link></li>
                          <li><Link href="/category/아웃도어/1754/" className="text-gray-600 hover:text-black">아웃도어</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* 나머지 모든 메뉴들은 동일하게 유지... */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('lighting')}
                >
                  <Link 
                    href="/category/lighting/225/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Lighting
                  </Link>

                  {activeMenu === 'lighting' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/lighting/225/" className="text-gray-600 hover:text-black">전체</Link></li>
                          <li><Link href="/category/펜던트램프/2541/" className="text-gray-600 hover:text-black">펜던트 램프</Link></li>
                          <li><Link href="/category/실링램프/2542/" className="text-gray-600 hover:text-black">실링 램프</Link></li>
                          <li><Link href="/category/데스크램프/2543/" className="text-gray-600 hover:text-black">데스크 램프</Link></li>
                          <li><Link href="/category/테이블램프/2544/" className="text-gray-600 hover:text-black">테이블 램프</Link></li>
                          <li><Link href="/category/플로어램프/2545/" className="text-gray-600 hover:text-black">플로어 램프</Link></li>
                          <li><Link href="/category/월램프/2546/" className="text-gray-600 hover:text-black">월 램프</Link></li>
                          <li><Link href="/category/포터블램프/2547/" className="text-gray-600 hover:text-black">포터블 램프</Link></li>
                          <li><Link href="/category/아웃도어램프/2548/" className="text-gray-600 hover:text-black">아웃도어 램프</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('kitchen')}
                >
                  <Link 
                    href="/category/kitchen/227/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Kitchen
                  </Link>

                  {activeMenu === 'kitchen' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/kitchen/227/" className="text-gray-600 hover:text-black">전체</Link></li>
                          <li><Link href="/category/컵시볼/2547/" className="text-gray-600 hover:text-black">컵시/볼</Link></li>
                          <li><Link href="/category/유리잔피처/2548/" className="text-gray-600 hover:text-black">유리잔/피처</Link></li>
                          <li><Link href="/category/머그티컵팟/2549/" className="text-gray-600 hover:text-black">머그/티컵/팟</Link></li>
                          <li><Link href="/category/커피티제품/2550/" className="text-gray-600 hover:text-black">커피/티제품</Link></li>
                          <li><Link href="/category/바웨어/2551/" className="text-gray-600 hover:text-black">바웨어</Link></li>
                          <li><Link href="/category/커틀러리/2552/" className="text-gray-600 hover:text-black">커틀러리</Link></li>
                          <li><Link href="/category/과일볼/2553/" className="text-gray-600 hover:text-black">과일볼</Link></li>
                          <li><Link href="/category/트레이/2554/" className="text-gray-600 hover:text-black">트레이</Link></li>
                          <li><Link href="/category/주방용품/2555/" className="text-gray-600 hover:text-black">주방용품</Link></li>
                          <li><Link href="/category/냄비주방팩토리/2556/" className="text-gray-600 hover:text-black">냄비/주방용 팩토리</Link></li>
                          <li><Link href="/category/스토리지/2557/" className="text-gray-600 hover:text-black">스토리지</Link></li>
                          <li><Link href="/category/푸드/2558/" className="text-gray-600 hover:text-black">푸드</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('accessories')}
                >
                  <Link 
                    href="/category/accessories/229/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Accessories
                  </Link>

                  {activeMenu === 'accessories' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/accessories/229/" className="text-gray-600 hover:text-black">Accessories</Link></li>
                          <li><Link href="/category/스토리지/2552/" className="text-gray-600 hover:text-black">스토리지</Link></li>
                          <li><Link href="/category/거울/2553/" className="text-gray-600 hover:text-black">거울</Link></li>
                          <li><Link href="/category/시계/2554/" className="text-gray-600 hover:text-black">시계</Link></li>
                          <li><Link href="/category/화병/2555/" className="text-gray-600 hover:text-black">화병</Link></li>
                          <li><Link href="/category/플랜터/2556/" className="text-gray-600 hover:text-black">플랜터</Link></li>
                          <li><Link href="/category/향캔들/2557/" className="text-gray-600 hover:text-black">향/캔들</Link></li>
                          <li><Link href="/category/오브제/2558/" className="text-gray-600 hover:text-black">오브제</Link></li>
                          <li><Link href="/category/모빌/2559/" className="text-gray-600 hover:text-black">모빌</Link></li>
                          <li><Link href="/category/후크월데코/2560/" className="text-gray-600 hover:text-black">후크/월데코</Link></li>
                          <li><Link href="/category/보드자석/2561/" className="text-gray-600 hover:text-black">보드/자석</Link></li>
                          <li><Link href="/category/툴/2562/" className="text-gray-600 hover:text-black">툴</Link></li>
                          <li><Link href="/category/오피스/2563/" className="text-gray-600 hover:text-black">오피스</Link></li>
                          <li><Link href="/category/욕실/2564/" className="text-gray-600 hover:text-black">욕실</Link></li>
                          <li><Link href="/category/페이퍼/2565/" className="text-gray-600 hover:text-black">페이퍼</Link></li>
                          <li><Link href="/category/반려동물용품/2566/" className="text-gray-600 hover:text-black">반려동물용품</Link></li>
                          <li><Link href="/category/아웃도어/2567/" className="text-gray-600 hover:text-black">아웃도어</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('textile')}
                >
                  <Link 
                    href="/category/textile/226/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Textile
                  </Link>

                  {activeMenu === 'textile' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/textile/226/" className="text-gray-600 hover:text-black">전체</Link></li>
                          <li><Link href="/category/원단/248/" className="text-gray-600 hover:text-black">원단</Link></li>
                          <li><Link href="/category/쿠션/246/" className="text-gray-600 hover:text-black">쿠션</Link></li>
                          <li><Link href="/category/방석/2921/" className="text-gray-600 hover:text-black">방석</Link></li>
                          <li><Link href="/category/블랭킷/245/" className="text-gray-600 hover:text-black">블랭킷</Link></li>
                          <li><Link href="/category/침실/244/" className="text-gray-600 hover:text-black">침실</Link></li>
                          <li><Link href="/category/욕실/247/" className="text-gray-600 hover:text-black">욕실</Link></li>
                          <li><Link href="/category/키친/2567/" className="text-gray-600 hover:text-black">키친</Link></li>
                          <li><Link href="/category/러그매트/243/" className="text-gray-600 hover:text-black">러그/매트</Link></li>
                          <li><Link href="/category/패션악세서리/2877/" className="text-gray-600 hover:text-black">패션 악세서리</Link></li>
                          <li><Link href="/category/파우치가방/2871/" className="text-gray-600 hover:text-black">파우치/가방</Link></li>
                          <li><Link href="/category/브로치패치/2872/" className="text-gray-600 hover:text-black">브로치/패치</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('kids')}
                >
                  <Link 
                    href="/category/kids/2596/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Kids
                  </Link>

                  {activeMenu === 'kids' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/kids/2596/" className="text-gray-600 hover:text-black">전체</Link></li>
                          <li><Link href="/category/어린이가구/2597/" className="text-gray-600 hover:text-black">어린이 가구</Link></li>
                          <li><Link href="/category/조명/2937/" className="text-gray-600 hover:text-black">조명</Link></li>
                          <li><Link href="/category/텍스타일/2598/" className="text-gray-600 hover:text-black">텍스타일</Link></li>
                          <li><Link href="/category/어린이시계/2935/" className="text-gray-600 hover:text-black">어린이 시계</Link></li>
                          <li><Link href="/category/장난감/2601/" className="text-gray-600 hover:text-black">장난감</Link></li>
                          <li><Link href="/category/보드자석/2933/" className="text-gray-600 hover:text-black">보드/자석</Link></li>
                          <li><Link href="/category/데코/2599/" className="text-gray-600 hover:text-black">데코</Link></li>
                          <li><Link href="/category/어린이식기/2600/" className="text-gray-600 hover:text-black">어린이 식기</Link></li>
                          <li><Link href="/category/문구/2612/" className="text-gray-600 hover:text-black">문구</Link></li>
                          <li><Link href="/category/도서/2915/" className="text-gray-600 hover:text-black">도서</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('book')}
                >
                  <Link 
                    href="/category/book/3021/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Book
                  </Link>

                  {activeMenu === 'book' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/book/3021/" className="text-gray-600 hover:text-black">전체</Link></li>
                          <li><Link href="/category/아트북/287/" className="text-gray-600 hover:text-black">아트북</Link></li>
                          <li><Link href="/category/매거진/504/" className="text-gray-600 hover:text-black">매거진</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('sale')}
                >
                  <Link 
                    href="/category/sale/233/" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-red-600 hover:text-red-700"
                  >
                    Sale
                  </Link>

                  {activeMenu === 'sale' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/category/sale/233/" className="text-gray-600 hover:text-black">Sale</Link></li>
                          <li><Link href="/category/디스카운트세일/233/" className="text-gray-600 hover:text-black">디스카운트 세일</Link></li>
                          <li><Link href="/category/리퍼브세일/234/" className="text-gray-600 hover:text-black">리퍼브 세일</Link></li>
                          <li><Link href="/category/플로어세일/235/" className="text-gray-600 hover:text-black">플로어 세일</Link></li>
                          <li><Link href="/category/퍼스널페이먼트/236/" className="text-gray-600 hover:text-black">퍼스널 페이먼트</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-px h-6 bg-gray-300 mx-4"></div>

                <Link 
                  href="/brands" 
                  className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                >
                  Brands
                </Link>

                <Link 
                  href="/designers" 
                  className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                >
                  Designers
                </Link>

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('curation')}
                >
                  <Link 
                    href="/curation" 
                    className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                  >
                    Curation
                  </Link>

                  {activeMenu === 'curation' && (
                    <div className="absolute top-full left-0 w-screen bg-white border-t shadow-lg">
                      <div className="px-4 lg:px-8 py-6">
                        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <li><Link href="/curation" className="text-gray-600 hover:text-black">Curation</Link></li>
                          <li><Link href="/curation/월간디자이너" className="text-gray-600 hover:text-black">월간디자이너</Link></li>
                          <li><Link href="/curation/이벤트" className="text-gray-600 hover:text-black">이벤트</Link></li>
                          <li><Link href="/curation/키워드" className="text-gray-600 hover:text-black">키워드</Link></li>
                          <li><Link href="/curation/오늘의루밍" className="text-gray-600 hover:text-black">#오늘의루밍</Link></li>
                          <li><Link href="/curation/루밍집들이" className="text-gray-600 hover:text-black">#루밍집들이</Link></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <Link 
                  href="/rdm" 
                  className="block px-4 py-6 text-2xl font-medium font-serif text-gray-700 hover:text-black"
                >
                  Rdm
                </Link>

              </nav>

              {/* 오른쪽 아이콘들 */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-3 text-gray-600 hover:text-black"
                >
                  <Search size={30} />
                </button>

                {user && (
                  <Link href="/mypage/wishlist" className="p-3 text-gray-600 hover:text-black">
                    <Heart size={30} />
                  </Link>
                )}

                {user ? (
                  <div className="relative group">
                    <button className="flex items-center p-3 text-gray-600 hover:text-black">
                      <User size={30} />
                    </button>
                    <div className="absolute -right-4 top-full mt-2 w-64 bg-white border shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-3 border-b">
                        <p className="text-sm font-medium break-all">{user.email}</p>
                      </div>
                      <Link href="/mypage" className="block px-4 py-2 text-sm hover:bg-gray-50">마이페이지</Link>
                      <button 
                        onClick={signOut}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/register" className="p-3 text-gray-600 hover:text-black">
                    <User size={30} />
                  </Link>
                )}

                {user && (
                  <Link href="/cart" className="relative p-3 text-gray-600 hover:text-black">
                    <ShoppingBag size={30} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <div className="lg:hidden">
          <div className="px-4">
            <div className="flex items-center justify-between h-16">
              
              {/* 왼쪽 - 햄버거 메뉴 */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-3 text-gray-600 hover:text-black"
              >
                <Menu size={30} />
              </button>

              {/* 중앙 - 로고 */}
              <Link href="/" className="flex-1 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="40" viewBox="0 0 180 40">
                  <text x="10" y="30" fontSize="36" fontFamily="serif" fill="black">SERQU</text>
                </svg>
              </Link>

              {/* 오른쪽 - 아이콘들 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-3 text-gray-600 hover:text-black"
                >
                  <Search size={30} />
                </button>

                {user ? (
                  <>
                    <Link href="/mypage" className="p-3 text-gray-600 hover:text-black">
                      <User size={30} />
                    </Link>
                    <Link href="/cart" className="relative p-3 text-gray-600 hover:text-black">
                      <ShoppingBag size={30} />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </>
                ) : (
                  <Link href="/register" className="p-3 text-gray-600 hover:text-black">
                    <User size={30} />
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>

      </header>

      {/* 검색 오버레이 */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="border-b p-4">
            <div className="max-w-3xl mx-auto flex items-center">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="ml-4 p-2 text-gray-600 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold mb-3">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {['herman miller', 'vitra', 'hay', 'fritz hansen', 'muuto', 'flos', 'carl hansen'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <nav className="px-2 space-y-1">
                <Link href="/category/new/223/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>New</Link>
                <Link href="/category/furniture/224/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Furniture</Link>
                <Link href="/category/lighting/225/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Lighting</Link>
                <Link href="/category/kitchen/227/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Kitchen</Link>
                <Link href="/category/accessories/229/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Accessories</Link>
                <Link href="/category/textile/226/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Textile</Link>
                <Link href="/category/kids/2596/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Kids</Link>
                <Link href="/category/book/3021/" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Book</Link>
                <Link href="/category/sale/233/" className="block px-2 py-2 text-base font-medium text-red-600 rounded-md hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>Sale</Link>
                
                <div className="border-t my-4"></div>
                
                <Link href="/brands" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Brands</Link>
                <Link href="/designers" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Designers</Link>
                <Link href="/curation" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Curation</Link>
                <Link href="/rdm" className="block px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Rdm</Link>
              </nav>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}

      {/* 오버레이 */}
      {(mobileMenuOpen || searchOpen) && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => {
            setMobileMenuOpen(false);
            setSearchOpen(false);
          }}
        />
      )}
    </>
  );
} 