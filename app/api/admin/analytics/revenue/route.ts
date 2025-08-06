import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 매출 통계 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    console.log('📊 매출 통계 조회 시작:', { range });

    // 기본 데이터 반환 (Firebase 연결 전에 먼저 테스트)
    const defaultData = {
      totalRevenue: 0,
      monthlyRevenue: 0,
      growth: 0,
      categoryRevenue: [],
      monthlyTrends: [
        { month: '2024년 1월', revenue: 0, orders: 0 },
        { month: '2024년 2월', revenue: 0, orders: 0 },
        { month: '2024년 3월', revenue: 0, orders: 0 },
        { month: '2024년 4월', revenue: 0, orders: 0 },
        { month: '2024년 5월', revenue: 0, orders: 0 },
        { month: '2024년 6월', revenue: 0, orders: 0 }
      ],
      paymentMethodStats: []
    };

    // Firebase 연결 테스트
    try {
      console.log('🔥 Firebase 연결 테스트 중...');
      
      // 가장 간단한 쿼리로 테스트
      const paymentsSnapshot = await getDocs(collection(db, 'payments'));
      console.log('💰 결제 컬렉션 문서 수:', paymentsSnapshot.docs.length);

      if (paymentsSnapshot.docs.length > 0) {
        // 실제 데이터가 있으면 계산
        const payments = paymentsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('결제 문서 데이터:', { id: doc.id, ...data });
          return {
            id: doc.id,
            amount: data.amount || 0,
            status: data.status || 'unknown',
            paidAt: data.paidAt?.toDate?.() || new Date()
          };
        });

        const completedPayments = payments.filter(p => p.status === 'completed');
        const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

        console.log('계산된 매출:', { 
          totalPayments: payments.length, 
          completedPayments: completedPayments.length,
          totalRevenue 
        });

        defaultData.totalRevenue = totalRevenue;
        defaultData.monthlyRevenue = totalRevenue;
      }

    } catch (firebaseError) {
      console.error('Firebase 연결 에러:', firebaseError);
      // Firebase 에러가 있어도 기본 데이터 반환
    }

    console.log('✅ 매출 통계 응답:', defaultData);
    return NextResponse.json(defaultData);

  } catch (error) {
    console.error('❌ 매출 통계 조회 실패:', error);
    console.error('에러 스택:', (error as Error).stack);
    
    // 에러가 발생해도 기본 데이터 반환
    return NextResponse.json({
      totalRevenue: 0,
      monthlyRevenue: 0,
      growth: 0,
      categoryRevenue: [],
      monthlyTrends: [],
      paymentMethodStats: []
    });
  }
}