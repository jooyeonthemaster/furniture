'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Package, CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';

interface PaymentDetails {
  paymentKey: string;
  orderId: string;
  amount: number;
  paymentType: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentType = searchParams.get('paymentType');

    if (!paymentKey || !orderId || !amount) {
      setPaymentStatus('failed');
      setError('결제 정보가 올바르지 않습니다.');
      return;
    }

    // 결제 승인 API 호출
    const confirmPayment = async () => {
      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setPaymentDetails({
            paymentKey,
            orderId,
            amount: parseInt(amount),
            paymentType: paymentType || 'NORMAL',
          });
          setPaymentStatus('success');
        } else {
          const errorData = await response.json();
          setError(errorData.error || '결제 승인에 실패했습니다.');
          setPaymentStatus('failed');
        }
      } catch (err) {
        console.error('결제 승인 에러:', err);
        setError('결제 승인 중 오류가 발생했습니다.');
        setPaymentStatus('failed');
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Clock className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            결제 처리 중...
          </h1>
          <p className="text-gray-600">
            결제를 확인하고 있습니다. 잠시만 기다려 주세요.
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            결제 실패
          </h1>
          <p className="text-gray-600 mb-8">
            {error || '결제 처리 중 문제가 발생했습니다.'}
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/cart"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              장바구니로 돌아가기
            </Link>
            <Link 
              href="/"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            결제가 완료되었습니다!
          </h1>
          <p className="text-gray-600">
            주문이 성공적으로 접수되었습니다.
          </p>
        </div>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">결제 정보</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호</span>
                <span className="font-medium">{paymentDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제금액</span>
                <span className="font-medium">{paymentDetails.amount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제방식</span>
                <span className="font-medium">{paymentDetails.paymentType}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4">
            <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xs text-gray-600">주문접수</div>
            <div className="text-xs font-medium text-green-600">완료</div>
          </div>
          <div className="text-center p-4">
            <CreditCard className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xs text-gray-600">결제확인</div>
            <div className="text-xs font-medium text-green-600">완료</div>
          </div>
          <div className="text-center p-4">
            <Truck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-xs text-gray-600">배송준비</div>
            <div className="text-xs font-medium text-gray-400">대기</div>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            href="/mypage/orders"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            주문 내역 보기
          </Link>
          <Link 
            href="/"
            className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Clock className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            로딩 중...
          </h1>
          <p className="text-gray-600">
            잠시만 기다려 주세요.
          </p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 