'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, Eye, Edit, Truck, CheckCircle,
  Calendar, User, CreditCard, MapPin, Package,
  ExternalLink, Copy, Mail
} from 'lucide-react';
import { Order } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type OrderStatus = 'all' | 'payment_pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onStatusUpdate: (orderId: string, newStatus: string, shippingInfo?: any) => Promise<void>;
  currentStatus: OrderStatus;
}

interface ExpandedOrder {
  [key: string]: boolean;
}

export function OrderTable({ 
  orders, 
  loading, 
  onStatusUpdate, 
  currentStatus 
}: OrderTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<ExpandedOrder>({});
  const [editingShipping, setEditingShipping] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState({
    carrier: '',
    trackingNumber: '',
    notes: ''
  });

  // 주문 확장/축소
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // 송장 입력 모드 토글
  const toggleShippingEdit = (orderId: string, currentShippingInfo?: any) => {
    if (editingShipping === orderId) {
      setEditingShipping(null);
      setShippingForm({ carrier: '', trackingNumber: '', notes: '' });
    } else {
      setEditingShipping(orderId);
      setShippingForm({
        carrier: currentShippingInfo?.carrier || '',
        trackingNumber: currentShippingInfo?.trackingNumber || '',
        notes: currentShippingInfo?.notes || ''
      });
    }
  };

  // 송장 정보 저장
  const handleShippingSave = async (orderId: string) => {
    try {
      const shippingInfo = {
        carrier: shippingForm.carrier,
        trackingNumber: shippingForm.trackingNumber,
        notes: shippingForm.notes,
        shippedAt: new Date().toISOString()
      };

      // 주문 상태 업데이트
      await onStatusUpdate(orderId, 'shipped', shippingInfo);
      
      // 이메일 알림 발송
      try {
        const emailResponse = await fetch('/api/admin/orders/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            shippingInfo
          }),
        });

        if (emailResponse.ok) {
          console.log('✅ 배송 안내 이메일 발송 완료');
        } else {
          console.warn('⚠️ 이메일 발송 실패 (주문 상태는 업데이트됨)');
        }
      } catch (emailError) {
        console.warn('⚠️ 이메일 발송 중 오류 (주문 상태는 업데이트됨):', emailError);
      }
      
      setEditingShipping(null);
      setShippingForm({ carrier: '', trackingNumber: '', notes: '' });
      
    } catch (error) {
      console.error('송장 정보 저장 실패:', error);
      alert('송장 정보 저장에 실패했습니다.');
    }
  };

  // 주문 상태 변경
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await onStatusUpdate(orderId, newStatus);
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  // 상태별 색상 및 텍스트
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '결제대기', color: 'text-orange-600 bg-orange-100' };
      case 'preparing':
        return { text: '상품준비중', color: 'text-blue-600 bg-blue-100' };
      case 'shipped':
        return { text: '배송중', color: 'text-purple-600 bg-purple-100' };
      case 'delivered':
        return { text: '배송완료', color: 'text-green-600 bg-green-100' };
      case 'cancelled':
        return { text: '취소접수', color: 'text-red-600 bg-red-100' };
      case 'returned':
        return { text: '반품접수', color: 'text-yellow-600 bg-yellow-100' };
      default:
        return { text: status, color: 'text-gray-600 bg-gray-100' };
    }
  };

  // 금액 포맷
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MM월 dd일 HH:mm', { locale: ko });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-background border rounded-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
          <span className="text-sm opacity-60">주문 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-background border rounded-lg p-8 text-center">
        <Package className="w-12 h-12 mx-auto opacity-30 mb-4" />
        <h3 className="text-lg font-medium mb-2">주문이 없습니다</h3>
        <p className="text-sm opacity-60">
          {currentStatus === 'all' ? '등록된 주문이 없습니다.' : '해당 상태의 주문이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background border rounded-lg overflow-hidden">
      {/* 테이블 헤더 */}
      <div className="border-b bg-muted/50">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium opacity-80">
          <div className="col-span-1">선택</div>
          <div className="col-span-2">주문 정보</div>
          <div className="col-span-2">상품·배송지</div>
          <div className="col-span-2">결제 정보</div>
          <div className="col-span-2">주문 추가 정보</div>
          <div className="col-span-2">상태 관리</div>
          <div className="col-span-1">액션</div>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="divide-y">
        {orders.map((order, index) => {
          const statusDisplay = getStatusDisplay(order.status || 'pending');
          const isExpanded = expandedOrders[order.id];
          const isEditingShippingForThis = editingShipping === order.id;
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-muted/30 transition-colors"
            >
              {/* 메인 주문 행 */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm">
                {/* 선택 체크박스 */}
                <div className="col-span-1 flex items-start pt-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* 주문 정보 */}
                <div className="col-span-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-primary">
                      {order.orderNumber}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(order.orderNumber)}
                      className="p-1 hover:bg-muted rounded opacity-60 hover:opacity-100"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-1 text-xs opacity-60">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="text-xs opacity-60">
                    ID: {order.id.slice(-8)}
                  </div>
                </div>

                {/* 상품·배송지 */}
                <div className="col-span-2 space-y-1">
                  <div className="font-medium">
                    {order.items?.[0]?.productName || '상품 정보 없음'}
                    {order.items && order.items.length > 1 && (
                      <span className="text-xs opacity-60 ml-1">
                        외 {order.items.length - 1}건
                      </span>
                    )}
                  </div>
                  
                  {order.shippingAddress && (
                    <div className="text-xs space-y-1">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{order.shippingAddress.recipient}</span>
                      </div>
                      <div className="flex items-start space-x-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight opacity-60">
                          {order.shippingAddress.street}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 결제 정보 */}
                <div className="col-span-2 space-y-1">
                  <div className="font-medium">
                    {formatPrice(order.finalAmount || order.totalAmount || 0)}원
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center space-x-1">
                      <span className="opacity-60">상품:</span>
                      <span>{formatPrice(order.totalAmount || 0)}원</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="opacity-60">배송:</span>
                      <span>{formatPrice(order.shippingFee || 0)}원</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="w-3 h-3" />
                      <span className="opacity-60">
                        {order.paymentMethod || '결제정보없음'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 주문 추가 정보 */}
                <div className="col-span-2 space-y-1">
                  {order.notes && (
                    <div className="text-xs bg-muted/50 rounded p-2">
                      <span className="opacity-60">메모: </span>
                      <span>{order.notes}</span>
                    </div>
                  )}
                  
                  {order.shippingInfo?.trackingNumber && (
                    <div className="text-xs space-y-1">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-3 h-3" />
                        <span className="font-medium">
                          {order.shippingInfo.carrier}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="opacity-60">송장:</span>
                        <span className="font-mono">
                          {order.shippingInfo.trackingNumber}
                        </span>
                        <button className="p-1 hover:bg-muted rounded">
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 상태 관리 */}
                <div className="col-span-2 space-y-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                    {statusDisplay.text}
                  </div>
                  
                  {/* 상태별 액션 버튼 */}
                  <div className="flex flex-wrap gap-1">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        결제확인
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => toggleShippingEdit(order.id, order.shippingInfo)}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        송장입력
                      </button>
                    )}
                    
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        배송완료
                      </button>
                    )}

                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        취소처리
                      </button>
                    )}
                  </div>
                </div>

                {/* 액션 */}
                <div className="col-span-1 flex items-start space-x-1 pt-1">
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 송장 입력 폼 */}
              {isEditingShippingForThis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-4 border-t bg-blue-50/50"
                >
                  <div className="max-w-2xl space-y-4 pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-blue-800">배송 정보 입력</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">택배사</label>
                        <select
                          value={shippingForm.carrier}
                          onChange={(e) => setShippingForm(prev => ({ ...prev, carrier: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">택배사 선택</option>
                          <option value="CJ대한통운">CJ대한통운</option>
                          <option value="한진택배">한진택배</option>
                          <option value="롯데택배">롯데택배</option>
                          <option value="로젠택배">로젠택배</option>
                          <option value="우체국택배">우체국택배</option>
                          <option value="GSPostbox">GSPostbox</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">송장번호</label>
                        <input
                          type="text"
                          value={shippingForm.trackingNumber}
                          onChange={(e) => setShippingForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                          placeholder="송장번호를 입력하세요"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">배송 메모 (선택)</label>
                      <textarea
                        value={shippingForm.notes}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="배송 관련 메모를 입력하세요"
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleShippingSave(order.id)}
                        disabled={!shippingForm.carrier || !shippingForm.trackingNumber}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>배송 정보 저장 & 이메일 발송</span>
                      </button>

                      <button
                        onClick={() => toggleShippingEdit(order.id)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 확장된 주문 상세 정보 */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-4 border-t bg-muted/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* 상품 목록 상세 */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span>주문 상품 목록</span>
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="bg-background rounded-lg p-3 text-sm">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-xs opacity-60 mt-1">
                              수량: {item.quantity}개 × {formatPrice(item.price || 0)}원
                            </div>
                            <div className="text-xs font-medium mt-1">
                              소계: {formatPrice((item.quantity || 1) * (item.price || 0))}원
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 배송지 상세 */}
                    {order.shippingAddress && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>배송지 정보</span>
                        </h4>
                        <div className="bg-background rounded-lg p-3 text-sm space-y-2">
                          <div>
                            <span className="opacity-60">받는 분: </span>
                            <span className="font-medium">{order.shippingAddress.recipient}</span>
                          </div>
                          <div>
                            <span className="opacity-60">연락처: </span>
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                          <div>
                            <span className="opacity-60">주소: </span>
                            <span>{order.shippingAddress.street}</span>
                          </div>
                          <div>
                            <span className="opacity-60">우편번호: </span>
                            <span>{order.shippingAddress.zipCode}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}