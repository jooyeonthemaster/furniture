'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useWishlist } from '@/hooks/useWishlist';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Heart, 
  Truck, 
  CreditCard, 
  User, 
  Settings,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  MapPin
} from 'lucide-react';
import { Order, CustomerDashboard } from '@/types';

export default function MyPage() {
  const { user, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/register?redirect=/mypage');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 주문 내역 조회
        const ordersResponse = await fetch(`/api/orders?customerId=${user.id}`);
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          const orders = ordersData.orders || [];
          
          setRecentOrders(orders.slice(0, 3)); // 최근 3개 주문

          // 대시보드 데이터 계산
          const totalOrders = orders.length;
          const pendingOrders = orders.filter((order: Order) => 
            ['pending', 'confirmed', 'preparing', 'shipped'].includes(order.status)
          ).length;
          const totalSpent = orders
            .filter((order: Order) => order.status === 'delivered')
            .reduce((sum: number, order: Order) => sum + (order.finalAmount || order.totalAmount || 0), 0);

          setDashboard({
            totalOrders,
            pendingOrders,
            totalSpent,
            wishlistCount,
            recentOrders: orders.slice(0, 5),
            trackingInfo: orders
              .filter((order: Order) => order.shippingInfo?.trackingNumber)
              .map((order: Order) => order.shippingInfo!)
              .slice(0, 3)
          });
        }
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, router, wishlistCount]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'text-yellow-600 bg-yellow-100';
      case 'preparing':
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '주문 대기',
      confirmed: '주문 확인',
      payment_completed: '결제 완료',
      preparing: '상품 준비중',
      shipped: '배송 중',
      delivered: '배송 완료',
      cancelled: '주문 취소',
      returned: '반품',
      refunded: '환불 완료'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light mb-2">마이페이지</h1>
            <p className="text-muted-foreground">안녕하세요, {user?.name}님!</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>홈으로</span>
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 요약 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border rounded-lg p-6 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{dashboard?.totalOrders || 0}</div>
                <div className="text-sm text-muted-foreground">총 주문</div>
              </div>
              
              <div className="bg-white border rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{dashboard?.pendingOrders || 0}</div>
                <div className="text-sm text-muted-foreground">진행 중</div>
              </div>
              
              <div className="bg-white border rounded-lg p-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">{wishlistCount}</div>
                <div className="text-sm text-muted-foreground">찜 목록</div>
              </div>
              
              <div className="bg-white border rounded-lg p-6 text-center">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">
                  {dashboard ? `${(dashboard.totalSpent / 10000).toFixed(0)}만원` : '0원'}
                </div>
                <div className="text-sm text-muted-foreground">총 구매액</div>
              </div>
            </div>

            {/* 최근 주문 */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">최근 주문 내역</h2>
                <Link 
                  href="/mypage/orders"
                  className="text-primary hover:underline text-sm flex items-center"
                >
                  전체 보기
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">주문번호: {order.orderNumber || order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <p className="text-sm font-medium mt-1">
                            {(order.finalAmount || order.totalAmount || 0).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                      
                      {order.items && order.items.length > 0 && (
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={order.items[0].productImage || '/placeholder-image.jpg'}
                              alt={order.items[0].productName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{order.items[0].productName}</p>
                            {order.items.length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                외 {order.items.length - 1}개 상품
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/mypage/orders/${order.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            상세보기
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">아직 주문 내역이 없습니다.</p>
                  <Link 
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    쇼핑하러 가기
                  </Link>
                </div>
              )}
            </div>

            {/* 최근 활동 */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-medium mb-6">최근 활동</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>회원가입을 완료했습니다</span>
                  <span className="text-muted-foreground ml-auto">
                    {new Date(user?.createdAt || '').toLocaleDateString('ko-KR')}
                  </span>
                </div>
                {dashboard?.recentOrders && dashboard.recentOrders.length > 0 && (
                  <div className="flex items-center space-x-3 text-sm">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <span>최근 주문: {dashboard.recentOrders[0].items?.[0]?.productName || '상품명 없음'}</span>
                    <span className="text-muted-foreground ml-auto">
                      {new Date(dashboard.recentOrders[0].createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 프로필 정보 */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'customer' ? '일반 고객' : '딜러'}
                  </p>
                </div>
              </div>
              <Link
                href="/mypage/profile"
                className="block w-full text-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                프로필 수정
              </Link>
            </div>

            {/* 빠른 메뉴 */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-medium mb-4">빠른 메뉴</h3>
              <div className="space-y-2">
                <Link
                  href="/mypage/orders"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span>주문 내역</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
                
                <Link
                  href="/mypage/wishlist"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <span>찜 목록</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
                
                <Link
                  href="/mypage/shipping"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <span>배송 조회</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
                
                <Link
                  href="/mypage/payments"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span>결제 내역</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
                
                <Link
                  href="/mypage/addresses"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>배송지 관리</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
                
                <Link
                  href="/mypage/settings"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <span>설정</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* 고객센터 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium mb-2 text-blue-900">고객센터</h3>
              <p className="text-sm text-blue-700 mb-4">
                궁금한 점이 있으시면 언제든 문의하세요.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">전화:</span> 02-1234-5678
                </p>
                <p className="text-sm">
                  <span className="font-medium">이메일:</span> support@luxefurniture.com
                </p>
                <p className="text-sm">
                  <span className="font-medium">운영시간:</span> 평일 9:00-18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 