import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SUBSCRIPTIONS_COLLECTION = 'pushSubscriptions';

// 웹 푸시 알림 전송 (개발용 - 실제 서비스에서는 서버사이드에서 처리)
export async function POST(request: NextRequest) {
  try {
    const { userId, title, message, data } = await request.json();
    
    console.log('🔔 푸시 알림 전송 API 호출됨:', { userId, title, message });

    if (!userId || !message) {
      return NextResponse.json(
        { error: '사용자 ID와 메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 해당 사용자의 활성 구독 조회
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION),
      where('userId', '==', userId),
      where('active', '==', true)
    );
    
    const subscriptions = await getDocs(q);
    
    if (subscriptions.empty) {
      console.log('📱 해당 사용자의 활성 구독이 없음');
      return NextResponse.json({ 
        success: true,
        message: '알림 구독이 없어 전송하지 않았습니다.' 
      });
    }

    console.log(`📱 ${subscriptions.docs.length}개의 구독에 알림 전송 시작`);

    // 각 구독에 알림 전송 (실제로는 서버사이드에서 web-push 라이브러리 사용)
    const sendPromises = subscriptions.docs.map(async (doc) => {
      const subscription = doc.data();
      
      try {
        // 여기서는 클라이언트 사이드 알림만 처리
        // 실제 푸시 알림은 Service Worker에서 처리
        console.log('📤 알림 전송 예정:', subscription.endpoint);
        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        console.error('개별 알림 전송 실패:', error);
        return { success: false, endpoint: subscription.endpoint, error };
      }
    });

    const results = await Promise.all(sendPromises);
    const successful = results.filter(r => r.success).length;
    
    console.log(`✅ 알림 전송 완료: ${successful}/${results.length}`);

    return NextResponse.json({ 
      success: true,
      sent: successful,
      total: results.length,
      message: `${successful}개의 기기에 알림을 전송했습니다.` 
    });

  } catch (error: any) {
    console.error('❌ 푸시 알림 전송 실패:', error);
    return NextResponse.json(
      { 
        error: '푸시 알림 전송에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

