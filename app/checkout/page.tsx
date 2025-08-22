'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  PaymentWidgetInstance,
  loadPaymentWidget,
  ANONYMOUS,
} from '@tosspayments/payment-widget-sdk';
import { useAuth } from '@/components/providers/ClientProviders';
import { useCart } from '@/hooks/useCart';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Address } from '@/types';

const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { items: cartItems, totalAmount: cartTotalAmount, clearCart } = useCart();
  
  // 바로 구매 여부 확인
  const isDirect = searchParams.get('direct') === 'true';
  const [directItems, setDirectItems] = useState<any[]>([]);
  const [directItemsLoaded, setDirectItemsLoaded] = useState(false);
  
  // 실제 사용할 아이템과 총액
  const items = isDirect ? directItems : cartItems;
  const totalAmount = isDirect 
    ? directItems.reduce((sum, item) => sum + ((item.finalPrice || item.salePrice) * item.quantity), 0)
    : cartItems.reduce((sum, item) => sum + ((item.finalPrice || item.salePrice) * item.quantity), 0);
  
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance['renderPaymentMethods']> | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [paymentReady, setPaymentReady] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState({
    recipient: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'KR',
    phone: user?.phoneNumber || '',
  });
  const [notes, setNotes] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // 배송비 계산
  const shippingCost = totalAmount >= 100000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingCost;

  // 바로 구매 데이터 로드
  useEffect(() => {
    if (isDirect) {
      const directPurchaseData = sessionStorage.getItem('directPurchase');
      if (directPurchaseData) {
        try {
          const parsedData = JSON.parse(directPurchaseData);
          setDirectItems(parsedData.items || []);
          setDirectItemsLoaded(true);
        } catch (error) {
          console.error('바로 구매 데이터 파싱 실패:', error);
          setDirectItemsLoaded(true);
          router.push('/cart');
        }
      } else {
        setDirectItemsLoaded(true);
        router.push('/cart');
      }
    } else {
      setDirectItemsLoaded(true); // 일반 장바구니 구매인 경우
    }
  }, [isDirect, router]);

  // 저장된 주소 목록 불러오기
  const fetchSavedAddresses = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/addresses?customerId=${user.id}`);
      const data = await response.json();
      
      if (data.success && data.addresses) {
        setSavedAddresses(data.addresses);
        
        // 기본 주소가 있으면 선택
        const defaultAddress = data.addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id!);
          setShippingAddress({
            recipient: defaultAddress.recipientName,
            street: defaultAddress.address,
            city: defaultAddress.detailAddress || '',
            state: '',
            zipCode: defaultAddress.zipCode,
            country: 'KR',
            phone: defaultAddress.recipientPhone,
          });
        }
      }
    } catch (error) {
      console.error('주소 목록 조회 실패:', error);
    }
  };

  // 주소 선택 처리
  const handleAddressSelect = (addressId: string) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setShippingAddress({
        recipient: address.recipientName,
        street: address.address,
        city: address.detailAddress || '',
        state: '',
        zipCode: address.zipCode,
        country: 'KR',
        phone: address.recipientPhone,
      });
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/register?redirect=/checkout' + (isDirect ? '?direct=true' : ''));
      return;
    }

    // 저장된 주소 불러오기
    fetchSavedAddresses();

    // 바로 구매 데이터 로딩이 완료된 후에만 아이템 체크
    if (directItemsLoaded && items.length === 0) {
      router.push('/cart');
      return;
    }

    const initializePaymentWidget = async () => {
      try {
        if (!clientKey) {
          throw new Error('Toss Payments 클라이언트 키가 설정되지 않았습니다.');
        }

        // 토스 페이먼츠 위젯 초기화
        const paymentWidget = await loadPaymentWidget(
          clientKey, 
          user.id // customer key로 user ID 사용
        );

        // 결제 방법 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          '#payment-widget',
          { value: finalAmount },
          { variantKey: 'DEFAULT' }
        );

        // 이용약관 렌더링
        paymentWidget.renderAgreement('#agreement', {
          variantKey: 'AGREEMENT'
        });

        paymentWidgetRef.current = paymentWidget;
        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        
        setPaymentReady(true);
      } catch (error) {
        console.error('결제 위젯 초기화 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    // 바로 구매 데이터가 로드되기 전에는 초기화하지 않음
    if (directItemsLoaded) {
      initializePaymentWidget();
    }
  }, [user, items.length, finalAmount, router, directItemsLoaded]);

  // 결제 금액 업데이트
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget) {
      paymentMethodsWidget.updateAmount(finalAmount);
    }
  }, [finalAmount]);

  // 전화번호 형식 정리 함수
  const formatPhoneNumber = (phone: string): string | null => {
    if (!phone) return null;
    
    // 특수문자 제거 (하이픈, 공백, 괄호 등)
    const cleaned = phone.replace(/[^\d]/g, '');
    
    // 한국 전화번호 형식 검증 (010으로 시작하는 11자리, 또는 지역번호)
    if (cleaned.length === 11 && cleaned.startsWith('010')) {
      return cleaned;
    } else if (cleaned.length >= 9 && cleaned.length <= 11) {
      // 지역번호 (02, 031, 032 등)
      return cleaned;
    }
    
    return null; // 유효하지 않은 번호
  };

  const handlePayment = async () => {
    try {
      if (!paymentWidgetRef.current || !user) {
        throw new Error('결제 정보가 준비되지 않았습니다.');
      }

      if (!agreeToTerms) {
        alert('이용약관에 동의해주세요.');
        return;
      }

      if (!shippingAddress.recipient || !shippingAddress.street || !shippingAddress.city) {
        alert('배송 정보를 모두 입력해주세요.');
        return;
      }

      // 전화번호 형식 검증
      const formattedPhone = formatPhoneNumber(shippingAddress.phone);
      if (!formattedPhone) {
        alert('올바른 전화번호를 입력해주세요. (예: 01012345678)');
        return;
      }

      // 주문 생성
      console.log('주문 생성 요청 데이터:', {
        customerId: user.id,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          ...shippingAddress,
          phone: formattedPhone,
        },
        notes,
      });

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.id,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
          })),
          shippingAddress: {
            recipient: shippingAddress.recipient,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country,
            phone: formattedPhone, // 정리된 전화번호 사용
          },
          notes,
        }),
      });

      console.log('주문 생성 응답 상태:', orderResponse.status);

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('주문 생성 실패:', errorData);
        throw new Error(errorData.error || '주문 생성에 실패했습니다.');
      }

      const orderResult = await orderResponse.json();
      console.log('주문 생성 결과:', orderResult);
      const orderId = orderResult.orderId;

      // 토스 페이먼츠 결제 요청 - 전화번호 형식 정리
      const paymentData: any = {
        orderId,
        orderName: `쓸만한 가 주문 ${items.length}건`,
        customerName: user.name,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      };

      // 유효한 전화번호만 추가 (선택적 필드)
      if (formattedPhone) {
        paymentData.customerMobilePhone = formattedPhone;
      }

      await paymentWidgetRef.current.requestPayment(paymentData);

    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      alert(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading || !directItemsLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isDirect ? '바로 구매 정보를 불러오는 중...' : '결제 정보를 불러오는 중...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center mb-8">
          <Link 
            href={isDirect ? `/products/${directItems[0]?.productId}` : "/cart"} 
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {isDirect ? "상품으로 돌아가기" : "장바구니로 돌아가기"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 주문 정보 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-light mb-6">주문 정보</h1>
              
              {/* 주문 상품 목록 */}
              <div className="border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-4">주문 상품 ({items.length}개)</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id || item.productId} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                        
                        {/* 선택된 옵션 표시 */}
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="mt-1 space-y-1">
                            {Object.values(item.selectedOptions).map((option: any, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">{option.optionName}:</span>
                                <div className="flex items-center space-x-1">
                                  {option.colorCode && (
                                    <div
                                      className="w-3 h-3 rounded-full border border-gray-300"
                                      style={{ backgroundColor: option.colorCode }}
                                    />
                                  )}
                                  <span className="text-xs font-medium">{option.valueName}</span>
                                  {option.priceModifier && option.priceModifier !== 0 && (
                                    <span className="text-xs text-primary">
                                      ({option.priceModifier > 0 ? '+' : ''}{option.priceModifier.toLocaleString()}원)
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-sm mt-1">
                          {(item.finalPrice || item.salePrice).toLocaleString()}원 × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {((item.finalPrice || item.salePrice) * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 배송 정보 */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  배송 정보
                </h3>
                
                {/* 저장된 주소 선택 */}
                {savedAddresses.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium mb-2">저장된 배송지</label>
                    <select
                      value={selectedAddressId}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddressSelect(e.target.value);
                        } else {
                          setSelectedAddressId('');
                          setShippingAddress({
                            recipient: user?.name || '',
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: 'KR',
                            phone: user?.phoneNumber || '',
                          });
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="">새 주소 입력</option>
                      {savedAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.label} - {address.recipientName} ({address.address})
                        </option>
                      ))}
                    </select>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-muted-foreground">
                        마이페이지에서 배송지를 미리 등록하면 더 편리해요!
                      </p>
                      <Link 
                        href="/mypage/addresses"
                        className="text-xs text-primary hover:underline"
                      >
                        배송지 관리
                      </Link>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">받는 사람</label>
                      <input
                        type="text"
                        value={shippingAddress.recipient}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, recipient: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">연락처</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="01012345678"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">우편번호</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">주소</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="기본 주소를 입력하세요"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">상세 주소</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="동, 호수 등 (선택사항)"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">배송 메모</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="배송 시 요청사항이 있으시면 적어주세요"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-light mb-6">결제 정보</h2>
              
              {/* 결제 금액 요약 */}
              <div className="border rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{totalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>
                      {shippingCost === 0 ? '무료' : `${shippingCost.toLocaleString()}원`}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-xs text-green-600">10만원 이상 구매 시 무료배송</p>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>총 결제 금액</span>
                    <span>{finalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* 토스 페이먼츠 위젯 */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  결제 방법 선택
                </h3>
                
                {/* 결제 방법 위젯 */}
                <div id="payment-widget" className="border rounded-lg p-4"></div>
                
                {/* 이용약관 위젯 */}
                <div id="agreement" className="border rounded-lg p-4"></div>

                {/* 추가 약관 동의 */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      구매 조건 및 개인정보 처리방침에 동의합니다.
                    </span>
                  </label>
                </div>

                {/* 결제 버튼 */}
                <button
                  onClick={handlePayment}
                  disabled={!paymentReady || !agreeToTerms}
                  className={`w-full py-4 rounded-lg font-medium text-white transition-colors ${
                    paymentReady && agreeToTerms
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {!paymentReady ? '결제 준비 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
                </button>

                {/* 보안 안내 */}
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>SSL 보안 결제 시스템으로 안전하게 보호됩니다</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
} 