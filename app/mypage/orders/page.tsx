'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Home, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  User,
  ChevronRight,
  Search,
  Filter,
  RotateCcw
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '@/types';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증이 완료되었는데 사용자가 없으면 로그인 페이지로 이동
    if (!user) {
      router.push('/register?redirect=/mypage/orders');
      return;
    }
    fetchOrders();
  }, [user, router, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders?customerId=${user!.id}`);
      
      if (!response.ok) {
        throw new Error('주문 내역을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
      setError(error instanceof Error ? error.message : '주문 내역 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'text-yellow-600 bg-yellow-100';
      case 'payment_completed':
      case 'preparing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
      case 'returned':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
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

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status: PaymentStatus) => {
    const statusMap: Record<PaymentStatus, string> = {
      pending: '결제 대기',
      completed: '결제 완료',
      failed: '결제 실패',
      cancelled: '결제 취소',
      refunded: '환불 완료'
    };
    return statusMap[status] || status;
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.items || []).some(item => 
        item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/mypage" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5 mr-2" />
            마이페이지로 돌아가기
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light mb-2">주문 내역</h1>
            <p className="text-muted-foreground">
              {filteredOrders.length > 0 ? `총 ${filteredOrders.length}개의 주문` : '주문 내역이 없습니다'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-medium">{orders.length}</span>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="주문번호나 상품명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">모든 상태</option>
                <option value="pending">주문 대기</option>
                <option value="confirmed">주문 확인</option>
                <option value="payment_completed">결제 완료</option>
                <option value="preparing">상품 준비중</option>
                <option value="shipped">배송 중</option>
                <option value="delivered">배송 완료</option>
                <option value="cancelled">주문 취소</option>
                <option value="returned">반품</option>
                <option value="refunded">환불 완료</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* 주문 헤더 */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">주문번호: {order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {order.paymentStatus && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {getPaymentStatusText(order.paymentStatus)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span>총 결제금액: {formatPrice(order.totalAmount)}원</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>상품 {(order.items || []).length}개</span>
                    </div>
                    {order.shippingInfo?.trackingNumber && (
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span>운송장: {order.shippingInfo.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 주문 상품 목록 */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={item.productImage || '/placeholder.jpg'}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productName}</h3>
                          <p className="text-sm text-muted-foreground">
                            수량: {item.quantity}개 × {formatPrice(item.price)}원
                          </p>
                          {item.discount > 0 && (
                            <p className="text-sm text-red-600">
                              할인: -{formatPrice(item.discount)}원
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 배송 정보 */}
                <div className="p-6 bg-muted/50 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        배송 주소
                      </h4>
                      {order.shippingAddress ? (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{order.shippingAddress.recipientName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.detailAddress} {order.shippingAddress.zipCode}</p>
                          {order.shippingAddress.recipientPhone && (
                            <p className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {order.shippingAddress.recipientPhone}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">배송 주소 정보가 없습니다.</p>
                      )}
                    </div>
                    
                    {order.shippingInfo && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          배송 정보
                        </h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {order.shippingInfo.carrier && (
                            <p>택배사: {order.shippingInfo.carrier}</p>
                          )}
                          {order.shippingInfo.trackingNumber && (
                            <p>운송장: {order.shippingInfo.trackingNumber}</p>
                          )}
                          {order.shippingInfo.estimatedDelivery && (
                            <p>예상 배송일: {formatDate(order.shippingInfo.estimatedDelivery)}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="p-6 border-t border-border">
                  <div className="flex justify-end space-x-3">
                    {order.status === 'shipped' && (
                      <Link
                        href={`/mypage/shipping?orderId=${order.id}`}
                        className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        <span>배송 추적</span>
                      </Link>
                    )}
                    {/* 반품 신청 버튼: 배송 완료 상태인 경우만 표시 */}
                    {(() => {
                      // 디버깅을 위한 로그
                      if (order.status === 'delivered') {
                        console.log(`주문 ${order.id} 반품 버튼 조건 확인:`, {
                          status: order.status,
                          paymentStatus: order.paymentStatus,
                          canReturn: order.status === 'delivered'
                        });
                      }
                      
                      return order.status === 'delivered' && (
                        <Link
                          href={`/mypage/returns?orderId=${order.id}`}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>반품 신청</span>
                        </Link>
                      );
                    })()}
                    <Link
                      href={`/mypage/orders/${order.id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <span>상세 보기</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-light mb-4">주문 내역이 없습니다</h2>
            <p className="text-muted-foreground mb-8">
              아직 주문하신 상품이 없습니다. 다양한 상품을 둘러보세요.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>상품 둘러보기</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 