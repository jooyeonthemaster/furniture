import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  query, 
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ORDERS_COLLECTION = 'orders';

// 기존 주문들의 상태를 업데이트하는 유틸리티 API
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 주문 상태 일괄 업데이트 시작');
    
    const { action } = await request.json();

    if (action === 'update_pending_to_preparing') {
      // pending 상태인 주문들을 preparing으로 변경
      const q = query(collection(db, ORDERS_COLLECTION));
      const querySnapshot = await getDocs(q);

      const updatePromises = querySnapshot.docs.map(async (orderDoc) => {
        const orderData = orderDoc.data();
        
        // pending 상태인 주문만 preparing으로 변경
        if (orderData.status === 'pending') {
          await updateDoc(doc(db, ORDERS_COLLECTION, orderDoc.id), {
            status: 'preparing',
            updatedAt: serverTimestamp()
          });
          
          console.log(`📦 주문 ${orderData.orderNumber || orderDoc.id} 상태: pending → preparing`);
          return { id: orderDoc.id, updated: true };
        }
        
        return { id: orderDoc.id, updated: false };
      });

      const results = await Promise.all(updatePromises);
      const updatedCount = results.filter(r => r.updated).length;

      console.log(`✅ ${updatedCount}개 주문 상태 업데이트 완료`);

      return NextResponse.json({
        success: true,
        message: `${updatedCount}개 주문의 상태가 preparing으로 업데이트되었습니다.`,
        updatedCount,
        results
      });
    }

    return NextResponse.json(
      { error: '지원하지 않는 액션입니다.' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('주문 상태 업데이트 실패:', error);
    return NextResponse.json(
      { 
        error: '주문 상태 업데이트에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}