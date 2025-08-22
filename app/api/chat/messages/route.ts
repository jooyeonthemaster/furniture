import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, getChatSession } from '@/lib/chat';

// 메시지 전송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, senderId, senderType, content, attachments } = body;

    console.log('💬 메시지 전송 API 호출됨:', { sessionId, senderId, senderType, content });

    // 필수 필드 검증
    if (!sessionId || !senderId || !senderType || !content) {
      return NextResponse.json(
        { error: '세션 ID, 발신자 ID, 발신자 타입, 메시지 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    // senderType 검증
    if (!['customer', 'dealer', 'ai'].includes(senderType)) {
      return NextResponse.json(
        { error: '발신자 타입은 customer, dealer, ai 중 하나여야 합니다.' },
        { status: 400 }
      );
    }

    const messageId = await sendMessage(sessionId, senderId, senderType, content, attachments);
    
    // 메시지 전송 후 상대방에게 알림 전송
    try {
      const session = await getChatSession(sessionId);
      if (session) {
        const recipientId = senderType === 'customer' ? session.dealerId : session.customerId;
        
        if (recipientId) {
          // 알림 전송 (백그라운드에서 처리)
          fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: recipientId,
              title: '쓸만한 가',
              message: `새로운 메시지: ${content.slice(0, 50)}${content.length > 50 ? '...' : ''}`,
              data: {
                type: 'chat_message',
                sessionId: sessionId,
                senderId: senderId
              }
            })
          }).catch(error => {
            console.error('알림 전송 실패 (무시됨):', error);
          });
        }
      }
    } catch (notificationError) {
      console.error('알림 전송 중 에러 (메시지 전송은 성공):', notificationError);
    }
    
    return NextResponse.json({ 
      success: true, 
      messageId,
      message: '메시지가 전송되었습니다.' 
    });

  } catch (error: any) {
    console.error('❌ 메시지 전송 실패:', error);
    return NextResponse.json(
      { 
        error: '메시지 전송에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
