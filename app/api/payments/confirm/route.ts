import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

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
    // 1. 주문 상태 업데이트
    // 2. 재고 감소
    // 3. 알림 발송 등

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