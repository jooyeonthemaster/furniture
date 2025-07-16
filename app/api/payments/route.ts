import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PaymentHistory } from '@/types';

const PAYMENTS_COLLECTION = 'payments';
const ORDERS_COLLECTION = 'orders';

// 결제 내역 조회
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 결제 내역 조회 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const limitParam = searchParams.get('limit');
    const statusFilter = searchParams.get('status');

    console.log('📋 요청 파라미터:', { customerId, limitParam, statusFilter });

    if (!customerId) {
      console.log('❌ customerId 누락');
      return NextResponse.json(
        { error: 'customerId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('🔥 Firestore 쿼리 실행 중...');
    
    // 결제 내역 조회 쿼리 구성
    let q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('paidAt', 'desc')
    );

    // 상태 필터 적용
    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, PAYMENTS_COLLECTION),
        where('customerId', '==', customerId),
        where('status', '==', statusFilter),
        orderBy('paidAt', 'desc')
      );
    }

    // 제한 적용
    if (limitParam) {
      const limitNum = parseInt(limitParam);
      if (!isNaN(limitNum) && limitNum > 0) {
        q = query(q, limit(limitNum));
      }
    }

    console.log('📊 쿼리 생성 완료:', { collection: PAYMENTS_COLLECTION, customerId });

    const querySnapshot = await getDocs(q);
    
    console.log('📥 쿼리 결과:', { 
      docsCount: querySnapshot.docs.length,
      isEmpty: querySnapshot.empty 
    });

    const payments: PaymentHistory[] = [];
    
    for (const paymentDoc of querySnapshot.docs) {
      const paymentData = paymentDoc.data();
      console.log('📄 결제 문서 데이터:', { id: paymentDoc.id, data: paymentData });
      
      // 관련 주문 정보 조회
      let orderData = null;
      if (paymentData.orderId) {
        try {
          const orderRef = doc(db, ORDERS_COLLECTION, paymentData.orderId);
          const orderSnap = await getDoc(orderRef);
          if (orderSnap.exists()) {
            orderData = {
              id: orderSnap.id,
              ...orderSnap.data(),
              createdAt: orderSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: orderSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
          }
        } catch (orderError) {
          console.error('주문 정보 조회 실패:', orderError);
        }
      }
      
      const payment: PaymentHistory = {
        id: paymentDoc.id,
        orderId: paymentData.orderId,
        paymentKey: paymentData.paymentKey,
        amount: paymentData.amount,
        method: paymentData.method,
        status: paymentData.status,
        paidAt: paymentData.paidAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        refundedAt: paymentData.refundedAt?.toDate?.()?.toISOString(),
        refundAmount: paymentData.refundAmount,
        order: orderData as any
      };
      
      payments.push(payment);
    }

    console.log('✅ 결제 내역 조회 성공:', payments.length, '개 항목');
    return NextResponse.json({ payments });

  } catch (error) {
    console.error('❌ 결제 내역 조회 실패:', error);
    console.error('에러 상세:', {
      message: (error as Error).message,
      code: (error as any).code,
      stack: (error as Error).stack
    });
    
    return NextResponse.json(
      { 
        error: '결제 내역 조회에 실패했습니다.',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// 결제 정보 업데이트 (환불 등)
export async function PUT(request: NextRequest) {
  try {
    const { paymentId, status, refundAmount } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'paymentId와 status가 필요합니다.' },
        { status: 400 }
      );
    }

    // 실제 구현에서는 결제 상태 업데이트 로직을 추가해야 함
    // 예: 토스 페이먼츠 API 호출, Firestore 업데이트 등

    return NextResponse.json({ 
      success: true, 
      message: '결제 정보가 업데이트되었습니다.' 
    });

  } catch (error) {
    console.error('결제 정보 업데이트 실패:', error);
    return NextResponse.json(
      { error: '결제 정보 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
} 