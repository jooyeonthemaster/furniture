'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, RefreshCw, 
  RotateCcw, CheckCircle, AlertCircle, Clock,
  Calendar, User, Package, FileText, Truck, XCircle
} from 'lucide-react';
import { ReturnRequest, ReturnReason, ReturnMethod, ReturnStatus } from '@/types';

// 상태별 카운트 타입
interface StatusCounts {
  all: number;
  requested: number;
  approved: number;
  rejected: number;
  in_progress: number;
  completed: number;
  refunded: number;
}

export type ReturnStatusFilter = 'all' | ReturnStatus;

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<ReturnRequest[]>([]);
  const [currentStatus, setCurrentStatus] = useState<ReturnStatusFilter>('all');
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    all: 0,
    requested: 0,
    approved: 0,
    rejected: 0,
    in_progress: 0,
    completed: 0,
    refunded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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

  // 반품 목록 조회
  const fetchReturns = async (status: ReturnStatusFilter = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('admin', 'true');
      if (status !== 'all') {
        params.append('status', status);
      }
      
      const response = await fetch(`/api/returns?${params}`);
      if (!response.ok) {
        throw new Error('반품 목록 조회에 실패했습니다.');
      }

      const data = await response.json();
      setReturns(data.returns || []);
      
      // 상태별 카운트 계산
      const allReturns = data.returns || [];
      setStatusCounts({
        all: allReturns.length,
        requested: allReturns.filter((r: ReturnRequest) => r.status === 'requested').length,
        approved: allReturns.filter((r: ReturnRequest) => r.status === 'approved').length,
        rejected: allReturns.filter((r: ReturnRequest) => r.status === 'rejected').length,
        in_progress: allReturns.filter((r: ReturnRequest) => r.status === 'in_progress').length,
        completed: allReturns.filter((r: ReturnRequest) => r.status === 'completed').length,
        refunded: allReturns.filter((r: ReturnRequest) => r.status === 'refunded').length,
      });
      
    } catch (error) {
      console.error('반품 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchReturns();
  }, []);

  // 상태 변경 시 재조회
  useEffect(() => {
    fetchReturns(currentStatus);
  }, [currentStatus]);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = returns;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(returnReq => 
        returnReq.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnReq.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnReq.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReturns(filtered);
  }, [returns, searchTerm]);

  // 반품 상태 업데이트
  const handleStatusUpdate = async (returnId: string, newStatus: ReturnStatus, notes?: string, refundAmount?: number) => {
    try {
      setUpdatingStatus(returnId);
      
      const response = await fetch('/api/returns', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnId,
          status: newStatus,
          notes,
          refundAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('상태 업데이트에 실패했습니다.');
      }

      // 목록 새로고침
      await fetchReturns(currentStatus);
      
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // 상태별 색상 및 텍스트
  const getStatusDisplay = (status: ReturnStatus) => {
    switch (status) {
      case 'requested':
        return { text: '신청 완료', color: 'text-yellow-600 bg-yellow-100', icon: Clock };
      case 'approved':
        return { text: '승인됨', color: 'text-blue-600 bg-blue-100', icon: CheckCircle };
      case 'rejected':
        return { text: '거부됨', color: 'text-red-600 bg-red-100', icon: XCircle };
      case 'in_progress':
        return { text: '진행 중', color: 'text-purple-600 bg-purple-100', icon: Truck };
      case 'completed':
        return { text: '반품 완료', color: 'text-green-600 bg-green-100', icon: CheckCircle };
      case 'refunded':
        return { text: '환불 완료', color: 'text-gray-600 bg-gray-100', icon: CheckCircle };
      default:
        return { text: status, color: 'text-gray-600 bg-gray-100', icon: Package };
    }
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // 금액 포맷
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  if (loading) {
    return (
      <div className="bg-background border rounded-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
          <span className="text-sm opacity-60">반품 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">반품 관리</h1>
          <p className="text-sm opacity-60 mt-1">
            전체 {statusCounts.all}건의 반품 신청을 관리할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchReturns(currentStatus)}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* 상태 탭 */}
      <div className="bg-background border rounded-lg p-1">
        <div className="flex overflow-x-auto">
          {[
            { key: 'all' as ReturnStatusFilter, name: '전체', icon: Package, color: 'text-gray-600' },
            { key: 'requested' as ReturnStatusFilter, name: '신청 완료', icon: Clock, color: 'text-yellow-600' },
            { key: 'approved' as ReturnStatusFilter, name: '승인됨', icon: CheckCircle, color: 'text-blue-600' },
            { key: 'rejected' as ReturnStatusFilter, name: '거부됨', icon: XCircle, color: 'text-red-600' },
            { key: 'in_progress' as ReturnStatusFilter, name: '진행 중', icon: Truck, color: 'text-purple-600' },
            { key: 'completed' as ReturnStatusFilter, name: '반품 완료', icon: CheckCircle, color: 'text-green-600' },
            { key: 'refunded' as ReturnStatusFilter, name: '환불 완료', icon: CheckCircle, color: 'text-gray-600' },
          ].map((tab) => {
            const isActive = currentStatus === tab.key;
            const count = statusCounts[tab.key] || 0;
            
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentStatus(tab.key)}
                className={`
                  relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${isActive 
                    ? 'bg-foreground text-background shadow-lg' 
                    : 'hover:bg-muted'
                  }
                `}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-background' : tab.color}`} />
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{tab.name}</span>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${isActive 
                      ? 'bg-background/20 text-background' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 검색 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="주문번호, 반품ID, 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 반품 목록 */}
      <div className="bg-background border rounded-lg overflow-hidden">
        {filteredReturns.length === 0 ? (
          <div className="p-8 text-center">
            <RotateCcw className="w-12 h-12 mx-auto opacity-30 mb-4" />
            <h3 className="text-lg font-medium mb-2">반품 신청이 없습니다</h3>
            <p className="text-sm opacity-60">
              {currentStatus === 'all' ? '등록된 반품 신청이 없습니다.' : '해당 상태의 반품 신청이 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredReturns.map((returnReq, index) => {
              const statusDisplay = getStatusDisplay(returnReq.status);
              const StatusIcon = statusDisplay.icon;
              
              return (
                <motion.div
                  key={returnReq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* 기본 정보 */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-primary">
                          반품 ID: {returnReq.id?.slice(-8)}
                        </h3>
                        <p className="text-sm opacity-60">
                          주문번호: {returnReq.orderId.slice(-8)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs opacity-60">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(returnReq.requestedAt)}</span>
                      </div>

                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusDisplay.text}
                      </div>
                    </div>

                    {/* 반품 정보 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">반품 정보</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="opacity-60">사유: </span>
                          <span>{returnReasonMap[returnReq.reason]}</span>
                        </div>
                        <div>
                          <span className="opacity-60">방법: </span>
                          <span>{returnMethodMap[returnReq.returnMethod]}</span>
                        </div>
                        <div>
                          <span className="opacity-60">상품 수: </span>
                          <span>{returnReq.items.length}개</span>
                        </div>
                        {returnReq.refundAmount && (
                          <div>
                            <span className="opacity-60">환불 금액: </span>
                            <span className="font-medium">{formatPrice(returnReq.refundAmount)}원</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 상세 설명 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">상세 설명</h4>
                      <p className="text-sm opacity-80 bg-muted/50 rounded p-2">
                        {returnReq.description}
                      </p>
                      
                      {returnReq.notes && (
                        <div className="mt-2">
                          <h5 className="font-medium text-xs opacity-60 mb-1">관리자 메모</h5>
                          <p className="text-sm bg-blue-50 rounded p-2">
                            {returnReq.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">상태 관리</h4>
                      <div className="flex flex-wrap gap-2">
                        {returnReq.status === 'requested' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(returnReq.id!, 'approved')}
                              disabled={updatingStatus === returnReq.id}
                              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('거부 사유를 입력하세요:');
                                if (reason) {
                                  handleStatusUpdate(returnReq.id!, 'rejected', reason);
                                }
                              }}
                              disabled={updatingStatus === returnReq.id}
                              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                              거부
                            </button>
                          </>
                        )}
                        
                        {returnReq.status === 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(returnReq.id!, 'in_progress')}
                            disabled={updatingStatus === returnReq.id}
                            className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                          >
                            진행중으로 변경
                          </button>
                        )}
                        
                        {returnReq.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(returnReq.id!, 'completed')}
                            disabled={updatingStatus === returnReq.id}
                            className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            반품 완료
                          </button>
                        )}
                        
                        {returnReq.status === 'completed' && (
                          <button
                            onClick={() => {
                              const amount = prompt('환불 금액을 입력하세요:');
                              if (amount && !isNaN(Number(amount))) {
                                handleStatusUpdate(returnReq.id!, 'refunded', undefined, Number(amount));
                              }
                            }}
                            disabled={updatingStatus === returnReq.id}
                            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            환불 처리
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
