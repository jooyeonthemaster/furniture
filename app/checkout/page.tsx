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
  const { user, loading: authLoading } = useAuth();
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
    // 인증 상태가 로딩 중이면 기다림
    if (authLoading) {
      return;
    }
    
    // 인증 상태 로딩이 완료되었는데 사용자가 없으면 로그인 페이지로 리다이렉트
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

        // 위젯 렌더링이 완전히 완료된 후에 테스트 메시지 제거
        setTimeout(() => {
          const devToolsStyleRemove = () => {
            // 개발자 도구에서 하는 것처럼 안전한 선택자로 제거
            try {
              const alertElements = document.querySelectorAll('div[role="alert"]');
              alertElements.forEach(el => {
                if (el.textContent?.includes('테스트 환경') || el.textContent?.includes('실제로 결제되지 않습니다')) {
                  console.log('타겟 요소 발견, 제거 시도:', el);
                  el.remove();
                }
              });
            } catch(e) {
              console.error('타겟 요소 제거 실패:', e);
            }

            // 백업: 다른 방법들
            document.querySelectorAll('*[role="alert"]').forEach(el => {
              if (el.textContent?.includes('테스트 환경') || el.textContent?.includes('실제로 결제되지 않습니다')) {
                console.log('텍스트 기반 제거:', el);
                el.remove();
              }
            });
            
            try {
              const radixElements = document.querySelectorAll('div[id^="radix-"], span[id^="radix-"]');
              radixElements.forEach(el => {
                if (el.textContent?.includes('테스트 환경') || el.textContent?.includes('실제로 결제되지 않습니다')) {
                  console.log('radix ID 기반 제거:', el);
                  el.remove();
                }
              });
            } catch(e) {
              console.error('radix 요소 제거 실패:', e);
            }
            
            try {
              const cacheElements = document.querySelectorAll('.payment-widget-cache-1db4li2, .payment-widget-cache-1w0clqj, .payment-widget-cache-1o8j7f2, .payment-widget-cache-z32lwb, .payment-widget-cache-1smfk4g, .payment-widget-cache-1e4e9cy, .payment-widget-cache-amrvyn');
              cacheElements.forEach(el => {
                if (el.textContent?.includes('테스트 환경') || el.textContent?.includes('실제로 결제되지 않습니다')) {
                  console.log('클래스 기반 제거:', el);
                  el.remove();
                }
              });
            } catch(e) {
              console.error('클래스 요소 제거 실패:', e);
            }

            // 최후의 수단: 전체 DOM 스캔
            document.querySelectorAll('*').forEach(el => {
              const text = el.textContent || '';
              if (text === '테스트 환경 - 실제로 결제되지 않습니다.' || 
                  (text.includes('테스트 환경') && text.includes('실제로 결제되지 않습니다'))) {
                console.log('전체 스캔으로 제거:', el);
                el.remove();
              }
            });
          };

          // 여러 번 시도
          devToolsStyleRemove();
          setTimeout(devToolsStyleRemove, 50);
          setTimeout(devToolsStyleRemove, 100);
          setTimeout(devToolsStyleRemove, 200);
          setTimeout(devToolsStyleRemove, 500);
          setTimeout(devToolsStyleRemove, 1000);
          
          // 지속적 모니터링
          const persistentInterval = setInterval(devToolsStyleRemove, 100);
          setTimeout(() => clearInterval(persistentInterval), 5000);
        }, 500); // 위젯 렌더링 완료 후 충분한 시간 대기
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
  }, [user, items.length, finalAmount, router, directItemsLoaded, authLoading]);

  // 결제 금액 업데이트
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget) {
      paymentMethodsWidget.updateAmount(finalAmount);
    }
  }, [finalAmount]);

  // 토스페이먼츠 테스트 환경 메시지 완전 박멸 시스템 (위젯 로드 후에만 실행)
  useEffect(() => {
    // 결제 위젯이 준비되지 않았으면 실행하지 않음
    if (!paymentReady) {
      return;
    }
    // 최종 핵무기: 브루트포스 방식
    const bruteForceRemove = () => {
      try {
        // 1. 안전한 선택자로 직접 타겟팅
        const safeSelectors = [
          'div[role="alert"]',
          '.payment-widget-cache-1db4li2',
          '.payment-widget-cache-1w0clqj',
          '.payment-widget-cache-1o8j7f2',
          '.payment-widget-cache-z32lwb',
          '.payment-widget-cache-1smfk4g',
          '.payment-widget-cache-1e4e9cy',
          '.payment-widget-cache-amrvyn'
        ];

        safeSelectors.forEach(selector => {
          try {
            document.querySelectorAll(selector).forEach(el => {
              // 테스트 환경 메시지가 포함된 요소만 제거
              if (el.textContent?.includes('테스트 환경') || 
                  el.textContent?.includes('실제로 결제되지 않습니다') ||
                  el.querySelector && el.querySelector('*[id*="radix"]')) {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.style.setProperty('opacity', '0', 'important');
                el.style.setProperty('height', '0', 'important');
                el.style.setProperty('width', '0', 'important');
                el.style.setProperty('position', 'absolute', 'important');
                el.style.setProperty('top', '-99999px', 'important');
                el.style.setProperty('left', '-99999px', 'important');
                el.style.setProperty('z-index', '-99999', 'important');
                el.style.setProperty('pointer-events', 'none', 'important');
                el.remove();
              }
            });
          } catch(e) {
            console.error('선택자 오류:', selector, e);
          }
        });

        // 2. 간단하고 안전한 전체 DOM 스캔
        try {
          const allElements = document.querySelectorAll('*');
          allElements.forEach(el => {
            try {
              const text = el.textContent || '';
              const hasTestText = text.includes('테스트 환경') || text.includes('실제로 결제되지 않습니다');
              const hasAlertRole = el.getAttribute && el.getAttribute('role') === 'alert';
              const hasRadixId = el.id && typeof el.id === 'string' && el.id.includes('radix');
              const hasPaymentCache = el.className && typeof el.className === 'string' && el.className.includes('payment-widget-cache');
              
              if (hasTestText || hasAlertRole || hasRadixId || hasPaymentCache) {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.style.setProperty('opacity', '0', 'important');
                el.style.setProperty('height', '0', 'important');
                el.style.setProperty('width', '0', 'important');
                el.style.setProperty('position', 'absolute', 'important');
                el.style.setProperty('top', '-99999px', 'important');
                el.style.setProperty('left', '-99999px', 'important');
                el.style.setProperty('z-index', '-99999', 'important');
                el.style.setProperty('pointer-events', 'none', 'important');
                el.remove();
              }
            } catch(e) {
              // 개별 요소 처리 실패는 무시
            }
          });
        } catch(e) {
          console.error('전체 DOM 스캔 실패:', e);
        }

      } catch(e) {
        console.error('브루트포스 제거 실패:', e);
      }
    };

    // 즉시 실행
    bruteForceRemove();
    
    // 여러 시점에서 실행
    setTimeout(bruteForceRemove, 1);
    setTimeout(bruteForceRemove, 10);
    setTimeout(bruteForceRemove, 50);
    setTimeout(bruteForceRemove, 100);
    setTimeout(bruteForceRemove, 200);
    setTimeout(bruteForceRemove, 500);
    setTimeout(bruteForceRemove, 1000);

    // 안전한 간격으로 실행 (토스페이먼츠 위젯과 충돌 방지)
    const safeInterval = setInterval(bruteForceRemove, 500);

    // 안전한 DOM 변경 감지
    const safeObserver = new MutationObserver(() => {
      setTimeout(bruteForceRemove, 100); // 약간의 딜레이로 충돌 방지
    });

    safeObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      clearInterval(safeInterval);
      safeObserver.disconnect();
    }, 10000); // 10초 후 정리

  }, [paymentReady]);

  // 추가: 기존 박멸 시스템 (위젯 준비 후에만 실행)
  useEffect(() => {
    // 결제 위젯이 준비되지 않았으면 실행하지 않음
    if (!paymentReady) {
      return;
    }
    // 최종 병기: 모든 방법으로 제거
    const nuclearRemoveTestMessages = () => {
      // 1. 모든 role="alert" 요소 제거
      document.querySelectorAll('*[role="alert"]').forEach(el => {
        try {
          el.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;position:absolute!important;top:-99999px!important;left:-99999px!important;z-index:-99999!important;pointer-events:none!important;';
          el.remove();
        } catch(e) {}
      });

      // 2. 모든 radix ID 요소 제거  
      document.querySelectorAll('*[id*="radix"]').forEach(el => {
        try {
          el.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;position:absolute!important;top:-99999px!important;left:-99999px!important;z-index:-99999!important;pointer-events:none!important;';
          el.remove();
        } catch(e) {}
      });

      // 3. 모든 payment-widget-cache 클래스 제거
      document.querySelectorAll('*[class*="payment-widget-cache"]').forEach(el => {
        try {
          el.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;position:absolute!important;top:-99999px!important;left:-99999px!important;z-index:-99999!important;pointer-events:none!important;';
          el.remove();
        } catch(e) {}
      });

      // 4. 텍스트 기반 검색으로 제거
      document.querySelectorAll('*').forEach(el => {
        try {
          const text = el.textContent || '';
          const html = el.innerHTML || '';
          if (text.includes('테스트 환경') || text.includes('실제로 결제되지 않습니다') || 
              html.includes('테스트 환경') || html.includes('실제로 결제되지 않습니다')) {
            
            // 완전 박멸 스타일 적용
            el.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;max-height:0!important;max-width:0!important;min-height:0!important;min-width:0!important;padding:0!important;margin:0!important;border:none!important;outline:none!important;box-shadow:none!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;overflow:hidden!important;position:absolute!important;top:-99999px!important;left:-99999px!important;right:-99999px!important;bottom:-99999px!important;z-index:-99999!important;pointer-events:none!important;user-select:none!important;cursor:none!important;transform:scale(0)!important;clip:rect(0,0,0,0)!important;';
            
            // 클래스와 ID 제거
            el.className = '';
            el.id = '';
            
            // 내용 제거
            el.innerHTML = '';
            el.textContent = '';
            
            // DOM에서 완전 제거
            el.remove();
          }
        } catch(e) {}
      });

      // 5. CSS 변수 기반 검색
      document.querySelectorAll('*[style*="--pc-alert"]').forEach(el => {
        try {
          el.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;position:absolute!important;top:-99999px!important;left:-99999px!important;z-index:-99999!important;pointer-events:none!important;';
          el.remove();
        } catch(e) {}
      });

      // 6. TDS 관련 요소 제거
      document.querySelectorAll('*[data-tds-desktop-icon-button-theme], *[data-tds-desktop-icon-button-mode], *[data-tds-icon-desktop-button-focus-ring-reverse]').forEach(el => {
        try {
          if (el.closest('*[role="alert"]') || el.textContent?.includes('테스트') || el.textContent?.includes('실제로 결제되지')) {
            el.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;position:absolute!important;top:-99999px!important;left:-99999px!important;z-index:-99999!important;pointer-events:none!important;';
            el.remove();
          }
        } catch(e) {}
      });

      // 7. SVG 아이콘까지 제거
      document.querySelectorAll('svg').forEach(svg => {
        try {
          const parent = svg.closest('*[role="alert"]') || svg.closest('*[class*="payment-widget-cache"]');
          if (parent) {
            svg.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;position:absolute!important;top:-99999px!important;left:-99999px!important;z-index:-99999!important;pointer-events:none!important;';
            svg.remove();
          }
        } catch(e) {}
      });
    };

    // DOM 로드 즉시 실행
    nuclearRemoveTestMessages();

    // 여러 시점에서 실행
    setTimeout(nuclearRemoveTestMessages, 1);
    setTimeout(nuclearRemoveTestMessages, 10);
    setTimeout(nuclearRemoveTestMessages, 50);
    setTimeout(nuclearRemoveTestMessages, 100);
    setTimeout(nuclearRemoveTestMessages, 200);
    setTimeout(nuclearRemoveTestMessages, 500);
    setTimeout(nuclearRemoveTestMessages, 1000);
    setTimeout(nuclearRemoveTestMessages, 2000);

    // 매우 자주 실행
    const aggressiveInterval = setInterval(nuclearRemoveTestMessages, 50);

    // 실시간 감시 및 즉시 제거
    const aggressiveObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const element = node as Element;
            
            // 즉시 검사하고 제거
            if (element.getAttribute('role') === 'alert' ||
                element.className?.includes('payment-widget-cache') ||
                element.id?.includes('radix') ||
                element.textContent?.includes('테스트 환경') ||
                element.textContent?.includes('실제로 결제되지 않습니다')) {
              
              try {
                element.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;position:absolute!important;top:-99999px!important;left:-99999px!important;z-index:-99999!important;pointer-events:none!important;';
                element.remove();
              } catch(e) {}
            }
          }
        });
      });
      
      // 변경 후 즉시 전체 스캔
      setTimeout(nuclearRemoveTestMessages, 1);
    });

    aggressiveObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'role', 'style', 'aria-describedby'],
      characterData: true
    });

    return () => {
      clearInterval(aggressiveInterval);
      aggressiveObserver.disconnect();
    };
  }, [paymentReady]);

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
      // 인증 상태 재확인
      if (authLoading) {
        alert('사용자 인증을 확인하는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      
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

  if (loading || !directItemsLoaded || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {authLoading 
              ? '사용자 인증을 확인하는 중...' 
              : isDirect 
                ? '바로 구매 정보를 불러오는 중...' 
                : '결제 정보를 불러오는 중...'
            }
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
                  disabled={!paymentReady || !agreeToTerms || authLoading}
                  className={`w-full py-4 rounded-lg font-medium text-white transition-colors ${
                    paymentReady && agreeToTerms && !authLoading
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {authLoading 
                    ? '사용자 인증 확인 중...' 
                    : !paymentReady 
                      ? '결제 준비 중...' 
                      : `${finalAmount.toLocaleString()}원 결제하기`
                  }
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