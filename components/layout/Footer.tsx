import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t py-12 xs:py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 xs:gap-6">
          <div>
            <div className="mb-4 xs:mb-3">
              <Image
                src="/logo.jpg"
                alt="CIRCU Logo"
                width={80}
                height={20}
                className="object-contain"
                style={{ width: 'auto', height: '20px' }}
              />
            </div>
            <p className="text-sm xs:text-xs opacity-70 mb-2">
              프리미엄 중고 디자이너 가구
            </p>
            <div className="text-xs opacity-60 space-y-1">
              <p>상호: 써큐</p>
              <p>대표자: 배준용</p>
              <p>사업자등록번호: 209-87-03584</p>
              <p>법인등록번호: 130111-0125475</p>
            </div>
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
          <div>
            <h4 className="text-sm tracking-widest mb-4 xs:mb-3">연락처</h4>
            <div className="text-xs opacity-60 space-y-1">
              <p>사업장 소재지:</p>
              <p>경기도 화성시 남양읍 남양로 484,</p>
              <p>2동 1층 4호</p>
              <br />
              <p>본점 소재지:</p>
              <p>경기도 화성시 남양읍 남양로 484,</p>
              <p>2동 1층 4호</p>
            </div>
          </div>
        </div>
        <div className="mt-12 xs:mt-8 pt-8 xs:pt-6 border-t text-center">
          <p className="text-sm xs:text-xs opacity-70">
            © 2025 CIRCU. 모든 권리 보유.
          </p>
          <p className="text-xs opacity-50 mt-2">
            개업연월일: 2025년 07월 01일 | 법인등록번호: 130111-0125475
          </p>
        </div>
      </div>
    </footer>
  );
} 