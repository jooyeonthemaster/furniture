import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SUBSCRIPTIONS_COLLECTION = 'pushSubscriptions';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    console.log('📱 푸시 구독 해제 API 호출됨');
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: '유효하지 않은 구독 정보입니다.' },
        { status: 400 }
      );
    }

    // 기존 구독 찾기
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION),
      where('endpoint', '==', subscription.endpoint)
    );
    
    const existingSubscriptions = await getDocs(q);
    
    if (!existingSubscriptions.empty) {
      // 구독 비활성화
      const existingDoc = existingSubscriptions.docs[0];
      await updateDoc(doc(db, SUBSCRIPTIONS_COLLECTION, existingDoc.id), {
        active: false,
        updatedAt: new Date()
      });
      
      console.log('✅ 푸시 구독 해제 완료');
    }

    return NextResponse.json({ 
      success: true,
      message: '푸시 알림 구독이 해제되었습니다.' 
    });

  } catch (error: any) {
    console.error('❌ 푸시 구독 해제 실패:', error);
    return NextResponse.json(
      { 
        error: '푸시 구독 해제에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}





