'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Home, 
  Truck, 
  Package, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Phone,
  Calendar,
  Info,
  ExternalLink
} from 'lucide-react';
import { Order, ShippingInfo, TrackingEvent, ShippingStatus } from '@/types';

function ShippingPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증이 완료되었는데 사용자가 없으면 로그인 페이지로 이동
    if (!user) {
      router.push('/register?redirect=/mypage/shipping');
      return;
    }
    fetchShippingOrders();
  }, [user, router, authLoading]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [orderId, orders]);

  const fetchShippingOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders?customerId=${user!.id}&hasShipping=true`);
      
      if (!response.ok) {
        throw new Error('배송 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      const shippingOrders = data.orders.filter((order: Order) => 
        order.shippingInfo && ['preparing', 'in_transit', 'delivered'].includes(order.shippingInfo.status)
      );
      setOrders(shippingOrders);
    } catch (error) {
      console.error('배송 정보 조회 실패:', error);
      setError(error instanceof Error ? error.message : '배송 정보 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateTrackingInfo = async (orderId: string) => {
    try {
      setTrackingLoading(true);
      
      const response = await fetch(`/api/shipping/track?orderId=${orderId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('배송 추적 정보 업데이트에 실패했습니다.');
      }
      
      const data = await response.json();
      
      // 주문 목록 업데이트
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, shippingInfo: data.shippingInfo }
          : order
      ));
      
      // 선택된 주문 업데이트
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, shippingInfo: data.shippingInfo } : null);
      }
      
    } catch (error) {
      console.error('배송 추적 업데이트 실패:', error);
      setError(error instanceof Error ? error.message : '배송 추적 업데이트에 실패했습니다.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getShippingStatusColor = (status: ShippingStatus) => {
    switch (status) {
      case 'preparing':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_transit':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'failed':
      case 'returned':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getShippingStatusText = (status: ShippingStatus) => {
    const statusMap: Record<ShippingStatus, string> = {
      preparing: '배송 준비중',
      in_transit: '배송 중',
      out_for_delivery: '배송 중',
      delivered: '배송 완료',
      failed: '배송 실패',
      returned: '반송'
    };
    return statusMap[status] || status;
  };

  const getShippingStatusIcon = (status: ShippingStatus) => {
    switch (status) {
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
      case 'returned':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
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
    if (searchQuery === '') return true;
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingInfo?.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingInfo?.carrier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some(item => 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">배송 정보를 불러오는 중...</p>
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
            <h1 className="text-3xl font-light mb-2">배송 조회</h1>
            <p className="text-muted-foreground">
              {filteredOrders.length > 0 ? `${filteredOrders.length}개의 배송 중인 주문` : '배송 중인 주문이 없습니다'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-medium">{orders.length}</span>
          </div>
        </div>

        {/* 검색 */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="주문번호, 운송장번호, 택배사, 상품명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {selectedOrder ? (
          /* 선택된 주문의 상세 배송 정보 */
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">주문번호: {selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  목록으로 돌아가기
                </button>
              </div>
              
              {selectedOrder.shippingInfo && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getShippingStatusColor(selectedOrder.shippingInfo.status)}`}>
                      {getShippingStatusIcon(selectedOrder.shippingInfo.status)}
                    </div>
                    <div>
                      <p className="font-medium">{getShippingStatusText(selectedOrder.shippingInfo.status)}</p>
                      <p className="text-sm text-muted-foreground">배송 상태</p>
                    </div>
                  </div>
                  
                  {selectedOrder.shippingInfo.carrier && (
                    <div>
                      <p className="font-medium">{selectedOrder.shippingInfo.carrier}</p>
                      <p className="text-sm text-muted-foreground">택배사</p>
                    </div>
                  )}
                  
                  {selectedOrder.shippingInfo.trackingNumber && (
                    <div>
                      <p className="font-medium font-mono">{selectedOrder.shippingInfo.trackingNumber}</p>
                      <p className="text-sm text-muted-foreground">운송장 번호</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => updateTrackingInfo(selectedOrder.id)}
                  disabled={trackingLoading}
                  className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${trackingLoading ? 'animate-spin' : ''}`} />
                  <span>추적 정보 업데이트</span>
                </button>
                
                {selectedOrder.shippingInfo?.trackingNumber && (
                  <button
                    onClick={() => window.open(`https://tracker.delivery/#/${selectedOrder.shippingInfo?.carrier}/${selectedOrder.shippingInfo?.trackingNumber}`, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>외부 추적</span>
                  </button>
                )}
              </div>
            </div>

            {/* 배송 추적 내역 */}
            {selectedOrder.shippingInfo?.trackingHistory && selectedOrder.shippingInfo.trackingHistory.length > 0 && (
              <div className="p-6">
                <h3 className="font-medium mb-4">배송 추적 내역</h3>
                <div className="space-y-4">
                  {selectedOrder.shippingInfo.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 배송지 정보 */}
            <div className="p-6 bg-muted/50 border-t border-border">
              <h3 className="font-medium mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                배송지 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{selectedOrder.shippingAddress.recipient}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedOrder.shippingAddress.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                  </p>
                  {selectedOrder.shippingAddress.phone && (
                    <p className="text-sm text-muted-foreground flex items-center mt-2">
                      <Phone className="w-3 h-3 mr-1" />
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  )}
                </div>
                
                {selectedOrder.shippingInfo?.estimatedDelivery && (
                  <div>
                    <p className="font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      예상 배송일
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(selectedOrder.shippingInfo.estimatedDelivery)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 주문 목록 */
          filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">주문번호: {order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      {order.shippingInfo && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getShippingStatusColor(order.shippingInfo.status)}`}>
                          {getShippingStatusIcon(order.shippingInfo.status)}
                          <span className="ml-1">{getShippingStatusText(order.shippingInfo.status)}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">총 금액</p>
                        <p className="font-medium">{formatPrice(order.totalAmount)}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">상품 수</p>
                        <p className="font-medium">{order.products.length}개</p>
                      </div>
                      {order.shippingInfo?.carrier && (
                        <div>
                          <p className="text-sm text-muted-foreground">택배사</p>
                          <p className="font-medium">{order.shippingInfo.carrier}</p>
                        </div>
                      )}
                      {order.shippingInfo?.trackingNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground">운송장</p>
                          <p className="font-medium font-mono text-sm">{order.shippingInfo.trackingNumber}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => updateTrackingInfo(order.id)}
                          disabled={trackingLoading}
                          className="flex items-center space-x-2 px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${trackingLoading ? 'animate-spin' : ''}`} />
                          <span>업데이트</span>
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                        >
                          <Info className="w-3 h-3" />
                          <span>상세 보기</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-light mb-4">배송 중인 주문이 없습니다</h2>
              <p className="text-muted-foreground mb-8">
                현재 배송 중인 주문이 없습니다. 주문 내역을 확인해보세요.
              </p>
              <Link 
                href="/mypage/orders"
                className="inline-flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span>주문 내역 보기</span>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function ShippingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShippingPageContent />
    </Suspense>
  );
} 