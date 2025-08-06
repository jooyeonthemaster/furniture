import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 주문 통계 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // 기본 데이터
    const defaultData = {
      totalOrders: 0,
      monthlyOrders: 0,
      growth: 0,
      statusStats: [
        { status: '주문 대기', count: 0, percentage: 0 },
        { status: '결제 완료', count: 0, percentage: 0 },
        { status: '배송 완료', count: 0, percentage: 0 }
      ],
      monthlyTrends: [],
      averageOrderValue: 0,
      hourlyDistribution: [],
      completedOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0
    };

    try {
      // 주문 데이터 조회
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      console.log('📋 주문 컬렉션 문서 수:', ordersSnapshot.docs.length);

      if (ordersSnapshot.docs.length > 0) {
        const orders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          status: doc.data().status || 'pending',
          finalAmount: doc.data().finalAmount || 0
        }));

        defaultData.totalOrders = orders.length;
        defaultData.monthlyOrders = orders.length;

        // 상태별 통계
        const statusCounts: { [key: string]: number } = {};
        orders.forEach(order => {
          const displayStatus = getOrderStatusDisplayName(order.status);
          statusCounts[displayStatus] = (statusCounts[displayStatus] || 0) + 1;
        });

        defaultData.statusStats = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
          percentage: orders.length > 0 ? (count / orders.length) * 100 : 0
        }));

        // 평균 주문 금액
        const ordersWithAmount = orders.filter(o => o.finalAmount > 0);
        if (ordersWithAmount.length > 0) {
          defaultData.averageOrderValue = ordersWithAmount.reduce((sum, o) => sum + o.finalAmount, 0) / ordersWithAmount.length;
        }
      }

    } catch (firebaseError) {
      console.error('Firebase 연결 에러:', firebaseError);
    }

    return NextResponse.json(defaultData);

  } catch (error) {
    console.error('❌ 주문 통계 조회 실패:', error);
    return NextResponse.json({
      totalOrders: 0,
      monthlyOrders: 0,
      growth: 0,
      statusStats: [],
      monthlyTrends: [],
      averageOrderValue: 0,
      hourlyDistribution: [],
      completedOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0
    });
  }
}

function getOrderStatusDisplayName(status: string): string {
  const statusMap: { [key: string]: string } = {
    'pending': '주문 대기',
    'confirmed': '주문 확인',
    'payment_completed': '결제 완료',
    'preparing': '상품 준비중',
    'shipped': '배송 중',
    'delivered': '배송 완료',
    'cancelled': '주문 취소',
    'returned': '반품',
    'refunded': '환불 완료'
  };
  return statusMap[status] || status;
}