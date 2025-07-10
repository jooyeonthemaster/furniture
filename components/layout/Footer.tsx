import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-12 xs:py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-4 gap-8 xs:gap-6">
          <div>
            <h4 className="text-sm tracking-widest mb-4 xs:mb-3">LUXE</h4>
            <p className="text-sm xs:text-xs opacity-70">
              프리미엄 중고 디자이너 가구
            </p>
          </div>
          <div>
            <h4 className="text-sm tracking-widest mb-4 xs:mb-3">쇼핑</h4>
            <ul className="space-y-2 xs:space-y-1">
              <li><Link href="/best" className="text-sm xs:text-xs opacity-70 hover:opacity-100">베스트</Link></li>
              <li><Link href="/special" className="text-sm xs:text-xs opacity-70 hover:opacity-100">기획전</Link></li>
              <li><Link href="/products" className="text-sm xs:text-xs opacity-70 hover:opacity-100">전체 상품</Link></li>
              <li><Link href="/brands" className="text-sm xs:text-xs opacity-70 hover:opacity-100">브랜드</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm tracking-widest mb-4 xs:mb-3">고객지원</h4>
            <ul className="space-y-2 xs:space-y-1">
              <li><Link href="/ai-chat" className="text-sm xs:text-xs opacity-70 hover:opacity-100">AI 채팅</Link></li>
              <li><Link href="/shipping" className="text-sm xs:text-xs opacity-70 hover:opacity-100">배송</Link></li>
              <li><Link href="/returns" className="text-sm xs:text-xs opacity-70 hover:opacity-100">반품/교환</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm tracking-widest mb-4 xs:mb-3">서비스</h4>
            <ul className="space-y-2 xs:space-y-1">
              <li><Link href="/mypage" className="text-sm xs:text-xs opacity-70 hover:opacity-100">마이페이지</Link></li>
              <li><Link href="/register" className="text-sm xs:text-xs opacity-70 hover:opacity-100">회원가입</Link></li>
              <li><Link href="/dealer/register" className="text-sm xs:text-xs opacity-70 hover:opacity-100">딜러 등록</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 xs:mt-8 pt-8 xs:pt-6 border-t text-center">
          <p className="text-sm xs:text-xs opacity-70">
            © 2025 LUXE FURNITURE. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  );
} 