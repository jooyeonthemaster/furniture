'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Home, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { PaymentHistory, PaymentStatus, PaymentMethod } from '@/types';

export default function PaymentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'all'>('all');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'all' | '1m' | '3m' | '6m' | '1y'>('all');

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증이 완료되었는데 사용자가 없으면 로그인 페이지로 이동
    if (!user) {
      router.push('/register?redirect=/mypage/payments');
      return;
    }
    fetchPayments();
  }, [user, router, authLoading]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/payments?customerId=${user!.id}`);
      
      if (!response.ok) {
        throw new Error('결제 내역을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('결제 내역 조회 실패:', error);
      setError(error instanceof Error ? error.message : '결제 내역 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
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

  const getStatusText = (status: PaymentStatus) => {
    const statusMap: Record<PaymentStatus, string> = {
      pending: '결제 대기',
      completed: '결제 완료',
      failed: '결제 실패',
      cancelled: '결제 취소',
      refunded: '환불 완료'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getMethodText = (method: PaymentMethod) => {
    const methodMap: Record<PaymentMethod, string> = {
      toss_card: '토스 카드',
      toss_account: '토스 계좌',
      toss_simple: '토스 간편결제',
      bank_transfer: '무통장 입금',
      virtual_account: '가상계좌'
    };
    return methodMap[method] || method;
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

  const getDateRangeFilter = () => {
    const now = new Date();
    const ranges = {
      '1m': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '3m': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      '6m': new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };
    return ranges[dateRange as keyof typeof ranges];
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesMethod = selectedMethod === 'all' || payment.method === selectedMethod;
    const matchesSearch = searchQuery === '' || 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentKey.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const filterDate = getDateRangeFilter();
      if (filterDate) {
        matchesDate = new Date(payment.paidAt) >= filterDate;
      }
    }
    
    return matchesStatus && matchesMethod && matchesSearch && matchesDate;
  });

  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = filteredPayments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + (p.refundAmount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">결제 내역을 불러오는 중...</p>
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
            <h1 className="text-3xl font-light mb-2">결제 내역</h1>
            <p className="text-muted-foreground">
              {filteredPayments.length > 0 ? `총 ${filteredPayments.length}개의 결제` : '결제 내역이 없습니다'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-medium">{payments.length}</span>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 결제 금액</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalAmount)}원</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">환불 금액</p>
                <p className="text-2xl font-bold text-red-600">{formatPrice(totalRefunded)}원</p>
              </div>
              <RefreshCw className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">성공 결제</p>
                <p className="text-2xl font-bold text-blue-600">
                  {payments.filter(p => p.status === 'completed').length}건
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="결제번호, 주문번호 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus | 'all')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">모든 상태</option>
                <option value="completed">결제 완료</option>
                <option value="pending">결제 대기</option>
                <option value="failed">결제 실패</option>
                <option value="cancelled">결제 취소</option>
                <option value="refunded">환불 완료</option>
              </select>
            </div>
            
            <div>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod | 'all')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">모든 결제수단</option>
                <option value="toss_card">토스 카드</option>
                <option value="toss_account">토스 계좌</option>
                <option value="toss_simple">토스 간편결제</option>
                <option value="bank_transfer">무통장 입금</option>
                <option value="virtual_account">가상계좌</option>
              </select>
            </div>
            
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">전체 기간</option>
                <option value="1m">최근 1개월</option>
                <option value="3m">최근 3개월</option>
                <option value="6m">최근 6개월</option>
                <option value="1y">최근 1년</option>
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

        {filteredPayments.length > 0 ? (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <h3 className="font-medium">결제번호: {payment.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          주문번호: {payment.orderId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.paidAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">결제 금액</p>
                      <p className="font-medium text-lg">{formatPrice(payment.amount)}원</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">결제 수단</p>
                      <p className="font-medium">{getMethodText(payment.method)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">결제 키</p>
                      <p className="font-mono text-sm">{payment.paymentKey}</p>
                    </div>
                    {payment.refundAmount && payment.refundAmount > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">환불 금액</p>
                        <p className="font-medium text-red-600">{formatPrice(payment.refundAmount)}원</p>
                        {payment.refundedAt && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(payment.refundedAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {payment.order && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium mb-2">주문 정보</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>상품 {payment.order.items?.length || 0}개</p>
                        <p>배송지: {(payment.order.shippingAddress as any)?.recipient || '배송지 정보 없음'}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-4">
                    <Link
                      href={`/mypage/orders/${payment.orderId}`}
                      className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>주문 상세</span>
                    </Link>
                    {payment.status === 'completed' && (
                      <button
                        onClick={() => window.open(`/api/payments/${payment.id}/receipt`, '_blank')}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>영수증</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-light mb-4">결제 내역이 없습니다</h2>
            <p className="text-muted-foreground mb-8">
              아직 결제하신 내역이 없습니다. 다양한 상품을 둘러보세요.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span>상품 둘러보기</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 