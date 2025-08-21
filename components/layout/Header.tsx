'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Heart, Menu, X, MoreHorizontal, Bell } from 'lucide-react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useCart } from '@/hooks/useCart';
import { useChatNotifications } from '@/hooks/useChatNotifications';

export default function Header() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { unreadCount } = useChatNotifications();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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

  const handleMoreMenuEnter = () => {
    setShowMoreMenu(true);
  };

  const handleMoreMenuLeave = () => {
    setShowMoreMenu(false);
  };

  // 모바일에서 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreMenu) {
        const target = event.target as Element;
        if (!target.closest('.mobile-more-menu')) {
          setShowMoreMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

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
          <div className="px-2 xl:px-8">
            <div className="flex items-center justify-between">
              
              {/* 왼쪽 메뉴들 */}
              <nav className="flex items-center">

                {/* 네비게이션 홈 로고 */}
                <Link href="/" className="mr-4 xl:mr-8 flex-shrink-0">
                  <Image
                    src="/logo.jpg"
                    alt="SERQU Logo"
                    width={120}
                    height={28}
                    className="xl:hidden object-contain"
                    style={{ width: 'auto', height: '28px' }}
                    priority
                  />
                  <Image
                    src="/logo.jpg"
                    alt="SERQU Logo"
                    width={160}
                    height={32}
                    className="hidden xl:block object-contain"
                    style={{ width: 'auto', height: '32px' }}
                    priority
                  />
                </Link>

                {/* 주요 메뉴들 - 항상 표시 */}
                <Link 
                  href="/category/new/223/" 
                  className="block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
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
                    className="block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
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

                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('lighting')}
                >
                  <Link 
                    href="/category/lighting/225/" 
                    className="block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
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

                {/* 중간 화면에서도 표시되는 메뉴들 */}
                <div 
                  className="relative hidden xl:block"
                  onMouseEnter={() => handleMenuEnter('kitchen')}
                >
                  <Link 
                    href="/category/kitchen/227/" 
                    className="block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
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
                  className="relative hidden xl:block"
                  onMouseEnter={() => handleMenuEnter('accessories')}
                >
                  <Link 
                    href="/category/accessories/229/" 
                    className="block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
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

                {/* Sale - 항상 표시 (중요) */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter('sale')}
                >
                  <Link 
                    href="/category/sale/233/" 
                    className="block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-red-600 hover:text-red-700 whitespace-nowrap"
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

                {/* 더보기 메뉴 - 작은 화면에서 숨겨진 메뉴들 */}
                <div 
                  className="relative xl:hidden"
                  onMouseEnter={handleMoreMenuEnter}
                  onMouseLeave={handleMoreMenuLeave}
                >
                  <button className="flex items-center px-2 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap">
                    <MoreHorizontal size={20} />
                  </button>

                  {showMoreMenu && (
                    <div className="absolute top-full right-0 w-48 bg-white border shadow-lg rounded-lg z-50">
                      <div className="py-2">
                        <Link href="/category/kitchen/227/" className="block px-4 py-2 text-sm hover:bg-gray-50">Kitchen</Link>
                        <Link href="/category/accessories/229/" className="block px-4 py-2 text-sm hover:bg-gray-50">Accessories</Link>
                        <Link href="/category/textile/226/" className="block px-4 py-2 text-sm hover:bg-gray-50">Textile</Link>
                        <Link href="/category/kids/2596/" className="block px-4 py-2 text-sm hover:bg-gray-50">Kids</Link>
                        <Link href="/category/book/3021/" className="block px-4 py-2 text-sm hover:bg-gray-50">Book</Link>
                        <div className="border-t my-1"></div>
                        <Link href="/brands" className="block px-4 py-2 text-sm hover:bg-gray-50">Brands</Link>
                        <Link href="/designers" className="block px-4 py-2 text-sm hover:bg-gray-50">Designers</Link>
                        <Link href="/curation" className="block px-4 py-2 text-sm hover:bg-gray-50">Curation</Link>
                        <Link href="/rdm" className="block px-4 py-2 text-sm hover:bg-gray-50">Rdm</Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* 큰 화면에서만 표시되는 추가 메뉴들 */}
                <div className="w-px h-6 bg-gray-300 mx-2 xl:mx-4 hidden 2xl:block"></div>

                <Link 
                  href="/brands" 
                  className="hidden 2xl:block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
                >
                  Brands
                </Link>

                <Link 
                  href="/designers" 
                  className="hidden 2xl:block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
                >
                  Designers
                </Link>

                <div 
                  className="relative hidden 2xl:block"
                  onMouseEnter={() => handleMenuEnter('curation')}
                >
                  <Link 
                    href="/curation" 
                    className="block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
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
                  className="hidden 2xl:block px-2 xl:px-3 py-4 xl:py-6 text-lg xl:text-xl font-medium font-serif text-gray-700 hover:text-black whitespace-nowrap"
                >
                  Rdm
                </Link>

              </nav>

              {/* 오른쪽 아이콘들 - 크기와 패딩 축소 */}
              <div className="flex items-center space-x-1 xl:space-x-2 flex-shrink-0">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 xl:p-3 text-gray-600 hover:text-black"
                >
                  <Search size={24} className="xl:w-7 xl:h-7" />
                </button>

                {user && (
                  <Link href="/mypage/wishlist" className="p-2 xl:p-3 text-gray-600 hover:text-black">
                    <Heart size={24} className="xl:w-7 xl:h-7" />
                  </Link>
                )}

                {user ? (
                  <div className="relative group">
                    <button className="flex items-center p-2 xl:p-3 text-gray-600 hover:text-black">
                      <User size={24} className="xl:w-7 xl:h-7" />
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
                  <Link href="/register" className="p-2 xl:p-3 text-gray-600 hover:text-black">
                    <User size={24} className="xl:w-7 xl:h-7" />
                  </Link>
                )}

                {user && (
                  <>
                    <Link href="/mypage/chats" className="relative p-2 xl:p-3 text-gray-600 hover:text-black">
                      <Bell size={24} className="xl:w-7 xl:h-7" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link href="/cart" className="relative p-2 xl:p-3 text-gray-600 hover:text-black">
                      <ShoppingBag size={24} className="xl:w-7 xl:h-7" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </>
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
                className="p-2 text-gray-600 hover:text-black flex-shrink-0"
              >
                <Menu size={24} />
              </button>

              {/* 중앙 - 로고 */}
              <Link href="/" className="flex-1 flex justify-center">
                <Image
                  src="/logo.jpg"
                  alt="SERQU Logo"
                  width={100}
                  height={24}
                  className="object-contain"
                  style={{ width: 'auto', height: '24px' }}
                  priority
                />
              </Link>

              {/* 오른쪽 - 더보기 메뉴 */}
              <div className="relative flex-shrink-0 mobile-more-menu">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <MoreHorizontal size={24} />
                </button>

                {/* 드롭다운 메뉴 */}
                {showMoreMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMoreMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border shadow-lg rounded-lg z-50 mobile-more-menu">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setSearchOpen(true);
                            setShowMoreMenu(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50"
                        >
                          <Search size={18} className="mr-3" />
                          검색
                        </button>
                        
                        {user && (
                          <Link 
                            href="/mypage/wishlist" 
                            className="flex items-center px-4 py-3 text-sm hover:bg-gray-50"
                            onClick={() => setShowMoreMenu(false)}
                          >
                            <Heart size={18} className="mr-3" />
                            위시리스트
                          </Link>
                        )}

                        {user ? (
                          <>
                            <Link 
                              href="/mypage" 
                              className="flex items-center px-4 py-3 text-sm hover:bg-gray-50"
                              onClick={() => setShowMoreMenu(false)}
                            >
                              <User size={18} className="mr-3" />
                              마이페이지
                            </Link>
                            
                            <Link 
                              href="/mypage/chats" 
                              className="flex items-center px-4 py-3 text-sm hover:bg-gray-50"
                              onClick={() => setShowMoreMenu(false)}
                            >
                              <Bell size={18} className="mr-3" />
                              알림
                              {unreadCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {unreadCount}
                                </span>
                              )}
                            </Link>
                            
                            <Link 
                              href="/cart" 
                              className="flex items-center px-4 py-3 text-sm hover:bg-gray-50"
                              onClick={() => setShowMoreMenu(false)}
                            >
                              <ShoppingBag size={18} className="mr-3" />
                              장바구니
                              {totalItems > 0 && (
                                <span className="ml-auto bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {totalItems}
                                </span>
                              )}
                            </Link>
                            
                            <div className="border-t my-1"></div>
                            
                            <div className="px-4 py-3 border-b bg-gray-50">
                              <p className="text-xs text-gray-600 break-all">{user.email}</p>
                            </div>
                            
                            <button
                              onClick={() => {
                                signOut();
                                setShowMoreMenu(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-red-600"
                            >
                              로그아웃
                            </button>
                          </>
                        ) : (
                          <Link 
                            href="/register" 
                            className="flex items-center px-4 py-3 text-sm hover:bg-gray-50"
                            onClick={() => setShowMoreMenu(false)}
                          >
                            <User size={18} className="mr-3" />
                            로그인/회원가입
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
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