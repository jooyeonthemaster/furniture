import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 반품 통계 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // 기본 데이터
    const defaultData = {
      totalReturns: 0,
      returnRate: 0,
      statusDistribution: [
        { status: '반품 신청', count: 0, percentage: 0 },
        { status: '반품 승인', count: 0, percentage: 0 },
        { status: '반품 완료', count: 0, percentage: 0 }
      ],
      reasonDistribution: [],
      methodDistribution: [],
      monthlyTrends: [],
      averageProcessingTime: 0,
      totalRefundAmount: 0,
      averageRefundAmount: 0,
      topReturnedProducts: [],
      pendingReturns: 0,
      approvedReturns: 0,
      completedReturns: 0,
      rejectedReturns: 0
    };

    try {
      // 반품 데이터 조회
      const returnsSnapshot = await getDocs(collection(db, 'returns'));
      console.log('🔄 반품 컬렉션 문서 수:', returnsSnapshot.docs.length);

      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      console.log('📋 주문 컬렉션 문서 수:', ordersSnapshot.docs.length);

      if (returnsSnapshot.docs.length > 0) {
        const returns = returnsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            status: data.status || 'requested',
            reason: data.reason || 'other',
            returnMethod: data.returnMethod || 'pickup',
            refundAmount: data.refundAmount || 0
          };
        });

        defaultData.totalReturns = returns.length;

        // 반품률 계산
        if (ordersSnapshot.docs.length > 0) {
          defaultData.returnRate = (returns.length / ordersSnapshot.docs.length) * 100;
        }

        // 상태별 분포
        const statusCounts: { [key: string]: number } = {};
        returns.forEach(returnItem => {
          const status = getReturnStatusDisplayName(returnItem.status);
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        defaultData.statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
          percentage: returns.length > 0 ? (count / returns.length) * 100 : 0
        }));

        // 환불 금액 계산
        const returnsWithRefund = returns.filter(r => r.refundAmount > 0);
        defaultData.totalRefundAmount = returnsWithRefund.reduce((sum, r) => sum + r.refundAmount, 0);
        if (returnsWithRefund.length > 0) {
          defaultData.averageRefundAmount = Math.round(defaultData.totalRefundAmount / returnsWithRefund.length);
        }

        // 상태별 카운트
        defaultData.pendingReturns = returns.filter(r => r.status === 'requested').length;
        defaultData.approvedReturns = returns.filter(r => r.status === 'approved').length;
        defaultData.completedReturns = returns.filter(r => r.status === 'completed').length;
        defaultData.rejectedReturns = returns.filter(r => r.status === 'rejected').length;
      }

    } catch (firebaseError) {
      console.error('Firebase 연결 에러:', firebaseError);
    }

    return NextResponse.json(defaultData);

  } catch (error) {
    console.error('❌ 반품 통계 조회 실패:', error);
    return NextResponse.json({
      totalReturns: 0,
      returnRate: 0,
      statusDistribution: [],
      reasonDistribution: [],
      methodDistribution: [],
      monthlyTrends: [],
      averageProcessingTime: 0,
      totalRefundAmount: 0,
      averageRefundAmount: 0,
      topReturnedProducts: [],
      pendingReturns: 0,
      approvedReturns: 0,
      completedReturns: 0,
      rejectedReturns: 0
    });
  }
}

function getReturnStatusDisplayName(status: string): string {
  const statusMap: { [key: string]: string } = {
    'requested': '반품 신청',
    'approved': '반품 승인',
    'rejected': '반품 거부',
    'in_progress': '반품 진행중',
    'completed': '반품 완료',
    'refunded': '환불 완료'
  };
  return statusMap[status] || status;
}