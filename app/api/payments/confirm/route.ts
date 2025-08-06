import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PaymentHistory } from '@/types';

interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount }: ConfirmPaymentRequest = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스 페이먼츠 API 호출을 위한 인증 헤더
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    if (!secretKey) {
      console.error('TOSS_PAYMENTS_SECRET_KEY가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '서버 설정 오류입니다.' },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${secretKey}:`).toString('base64');

    // 토스 페이먼츠 결제 승인 API 호출
    const tossResponse = await fetch(`${process.env.TOSS_PAYMENTS_API_URL}/v1/payments/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error('토스 페이먼츠 API 에러:', tossData);
      return NextResponse.json(
        { 
          error: tossData.message || '결제 승인에 실패했습니다.',
          code: tossData.code 
        },
        { status: tossResponse.status }
      );
    }

    console.log('결제 승인 성공:', {
      paymentKey: tossData.paymentKey,
      orderId: tossData.orderId,
      status: tossData.status,
      method: tossData.method,
      totalAmount: tossData.totalAmount
    });

    // 결제 성공 후 추가 처리 로직
    try {
      // 1. 주문 정보 조회하여 customerId 확인
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        console.error('주문을 찾을 수 없습니다:', orderId);
        throw new Error('주문을 찾을 수 없습니다.');
      }

      const orderData = orderSnap.data();
      const customerId = orderData.customerId;

      // 2. 결제 정보를 Firestore에 저장
      const paymentData = {
        orderId: tossData.orderId,
        paymentKey: tossData.paymentKey,
        amount: tossData.totalAmount,
        method: tossData.method?.toLowerCase()?.includes('card') ? 'toss_card' : 
                tossData.method?.toLowerCase()?.includes('account') ? 'toss_account' :
                tossData.method?.toLowerCase()?.includes('simple') ? 'toss_simple' : 'toss_card',
        status: 'completed',
        customerId: customerId,
        paidAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // 토스 페이먼츠 응답 데이터 저장
        tossData: {
          paymentKey: tossData.paymentKey,
          status: tossData.status,
          method: tossData.method,
          totalAmount: tossData.totalAmount,
          balanceAmount: tossData.balanceAmount,
          suppliedAmount: tossData.suppliedAmount,
          vat: tossData.vat,
          approvedAt: tossData.approvedAt,
          receipt: tossData.receipt,
          card: tossData.card
        }
      };

      // payments 컬렉션에 저장
      const paymentRef = await addDoc(collection(db, 'payments'), paymentData);
      console.log('💾 결제 정보 저장 성공:', paymentRef.id);

      // 3. 주문 상태를 payment_completed로 업데이트
      await updateDoc(orderRef, {
        status: 'payment_completed',
        paymentKey: tossData.paymentKey,
        paymentStatus: 'completed',
        updatedAt: serverTimestamp()
      });
      console.log('📋 주문 상태 업데이트 성공');

    } catch (storeError) {
      console.error('❌ 결제 정보 저장 실패:', storeError);
      // 결제는 성공했지만 DB 저장에 실패한 경우
      // 이 경우 관리자에게 알림을 보내거나 별도 처리 필요
    }

    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: tossData.paymentKey,
        orderId: tossData.orderId,
        status: tossData.status,
        method: tossData.method,
        totalAmount: tossData.totalAmount,
        approvedAt: tossData.approvedAt,
        receipt: tossData.receipt,
        card: tossData.card,
      }
    });

  } catch (error) {
    console.error('결제 승인 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 