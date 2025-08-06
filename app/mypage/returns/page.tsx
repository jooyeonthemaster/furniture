'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Home, 
  Package, 
  RotateCcw,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  X
} from 'lucide-react';
import { Order, ReturnRequest, ReturnReason, ReturnMethod } from '@/types';

// 반품 사유 매핑
const returnReasonMap: Record<ReturnReason, string> = {
  'defective': '상품 불량',
  'different_from_description': '설명과 다름',
  'size_mismatch': '사이즈 불일치',
  'color_mismatch': '색상 불일치',
  'damaged_delivery': '배송 중 파손',
  'changed_mind': '단순 변심',
  'quality_issue': '품질 문제',
  'other': '기타'
};

// 반품 방법 매핑
const returnMethodMap: Record<ReturnMethod, string> = {
  'pickup': '택배 수거',
  'direct_delivery': '직접 반납',
  'store_visit': '매장 방문'
};

function ReturnsPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // 반품 신청 폼 상태
  const [returnForm, setReturnForm] = useState({
    reason: '' as ReturnReason,
    description: '',
    returnMethod: '' as ReturnMethod,
    images: [] as File[]
  });

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증이 완료되었는데 사용자가 없으면 로그인 페이지로 이동
    if (!user) {
      router.push('/register?redirect=/mypage/returns');
      return;
    }
    
    if (orderId) {
      fetchOrderForReturn();
    } else {
      fetchReturns();
    }
  }, [user, router, orderId, authLoading]);

  const fetchOrderForReturn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders/${orderId}?customerId=${user!.id}`);
      
      if (!response.ok) {
        throw new Error('주문 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      
      if (data.order.status !== 'delivered') {
        setError('배송 완료된 주문만 반품 신청이 가능합니다.');
        return;
      }
      
      setOrder(data.order);
      setShowReturnForm(true);
      
    } catch (error) {
      console.error('주문 조회 실패:', error);
      setError(error instanceof Error ? error.message : '주문 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/returns?customerId=${user!.id}`);
      
      if (!response.ok) {
        throw new Error('반품 내역을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setReturns(data.returns);
      
    } catch (error) {
      console.error('반품 내역 조회 실패:', error);
      setError(error instanceof Error ? error.message : '반품 내역 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order || !returnForm.reason || !returnForm.description || !returnForm.returnMethod) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const returnData = {
        orderId: order.id,
        customerId: user!.id,
        items: order.items?.map(item => ({
          productId: item.productId || '',
          productName: item.productName || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          reason: returnForm.description
        })) || [],
        reason: returnForm.reason,
        description: returnForm.description,
        returnMethod: returnForm.returnMethod,
        images: [] // 이미지 업로드는 추후 구현
      };

      console.log('🔍 반품 신청 데이터:', returnData);
      console.log('🔍 사용자 정보:', { userId: user!.id, userEmail: user!.email });

      console.log('📦 반품 신청 API 호출 시작...');
      
      let response;
      try {
        response = await fetch('/api/returns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(returnData),
        });
        console.log('✅ fetch 성공, 응답 상태:', response.status);
      } catch (fetchError) {
        console.error('❌ fetch 실패:', fetchError);
        throw new Error('네트워크 오류가 발생했습니다.');
      }

      console.log('🔍 API 응답 상태:', response.status);
      console.log('🔍 API 응답 헤더:', [...response.headers.entries()]);

      if (!response.ok) {
        console.log('❌ 응답이 성공적이지 않음, 에러 데이터 파싱 시도...');
        
        let errorData;
        try {
          const responseText = await response.text();
          console.log('🔍 원본 응답 텍스트:', responseText);
          
          if (responseText) {
            errorData = JSON.parse(responseText);
          } else {
            errorData = { error: '서버에서 빈 응답을 받았습니다.' };
          }
        } catch (parseError) {
          console.error('❌ 응답 파싱 실패:', parseError);
          errorData = { error: '서버 응답을 파싱할 수 없습니다.' };
        }
        
        console.error('🔍 API 오류 응답:', errorData);
        throw new Error(errorData.error || '반품 신청에 실패했습니다.');
      }

      const successData = await response.json();
      console.log('🔍 API 성공 응답:', successData);

      // 성공 시 모달 표시
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('반품 신청 실패:', error);
      setError(error instanceof Error ? error.message : '반품 신청에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const getReturnStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-blue-600 bg-blue-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'in_progress':
        return 'text-purple-600 bg-purple-100';
      case 'completed':
      case 'refunded':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getReturnStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'requested': '신청 완료',
      'approved': '승인됨',
      'rejected': '거부됨',
      'in_progress': '진행 중',
      'completed': '반품 완료',
      'refunded': '환불 완료'
    };
    return statusMap[status] || status;
  };

  const getReturnStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Truck className="w-4 h-4" />;
      case 'completed':
      case 'refunded':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">불러오는 중...</p>
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
            <h1 className="text-3xl font-light mb-2">
              {showReturnForm ? '반품 신청' : '반품 내역'}
            </h1>
            <p className="text-muted-foreground">
              {showReturnForm ? '배송 완료된 상품의 반품을 신청할 수 있습니다.' : '반품 신청 내역을 확인하세요.'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-6 h-6 text-orange-500" />
            <span className="text-lg font-medium">{returns.length}</span>
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

        {showReturnForm && order ? (
          /* 반품 신청 폼 */
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">반품 신청서</h2>
            
            {/* 주문 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-3">주문 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">주문번호:</span>
                  <span className="ml-2 font-medium">{order.orderNumber || order.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">주문일:</span>
                  <span className="ml-2">{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">총 금액:</span>
                  <span className="ml-2 font-medium">{formatPrice(order.totalAmount)}원</span>
                </div>
                <div>
                  <span className="text-gray-600">상품 수:</span>
                  <span className="ml-2">{order.items?.length || 0}개</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-6">
              {/* 반품 사유 */}
              <div>
                <label className="block text-sm font-medium mb-2">반품 사유 *</label>
                <select
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, reason: e.target.value as ReturnReason }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">반품 사유를 선택하세요</option>
                  {Object.entries(returnReasonMap).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* 상세 설명 */}
              <div>
                <label className="block text-sm font-medium mb-2">상세 설명 *</label>
                <textarea
                  value={returnForm.description}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="반품 사유를 자세히 설명해주세요"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* 반품 방법 */}
              <div>
                <label className="block text-sm font-medium mb-2">반품 방법 *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(returnMethodMap).map(([key, value]) => (
                    <label
                      key={key}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        returnForm.returnMethod === key ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="returnMethod"
                        value={key}
                        checked={returnForm.returnMethod === key}
                        onChange={(e) => setReturnForm(prev => ({ ...prev, returnMethod: e.target.value as ReturnMethod }))}
                        className="sr-only"
                      />
                      <div className="text-center w-full">
                        <div className="font-medium">{value}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {key === 'pickup' && '택배 기사가 수거해갑니다'}
                          {key === 'direct_delivery' && '직접 반납해주세요'}
                          {key === 'store_visit' && '매장에 직접 방문해주세요'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{submitting ? '신청 중...' : '반품 신청'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* 반품 내역 목록 */
          returns.length > 0 ? (
            <div className="space-y-4">
              {returns.map((returnReq) => (
                <div key={returnReq.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">주문번호: {returnReq.orderId}</h3>
                        <p className="text-sm text-muted-foreground">
                          신청일: {formatDate(returnReq.requestedAt)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getReturnStatusColor(returnReq.status)}`}>
                        {getReturnStatusIcon(returnReq.status)}
                        <span className="ml-1">{getReturnStatusText(returnReq.status)}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">반품 사유</p>
                        <p className="font-medium">{returnReasonMap[returnReq.reason]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">반품 방법</p>
                        <p className="font-medium">{returnMethodMap[returnReq.returnMethod]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">상품 수</p>
                        <p className="font-medium">{returnReq.items.length}개</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">상세 설명</p>
                      <p className="text-sm">{returnReq.description}</p>
                    </div>

                    {returnReq.notes && (
                      <div className="mt-4 bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-800 font-medium mb-1">관리자 메모</p>
                        <p className="text-sm text-blue-700">{returnReq.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCcw className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-light mb-4">반품 내역이 없습니다</h2>
              <p className="text-muted-foreground mb-8">
                반품 신청을 원하시면 주문 내역에서 신청해주세요.
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

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">반품 신청 완료</h2>
              <p className="text-gray-600 mb-6">
                반품 신청이 성공적으로 접수되었습니다.<br />
                관리자 검토 후 처리 상태를 안내드리겠습니다.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/mypage/returns');
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  반품 내역 보기
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/mypage/orders');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  주문 내역으로
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReturnsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">페이지를 불러오는 중...</p>
        </div>
      </div>
    }>
      <ReturnsPageContent />
    </Suspense>
  );
}
