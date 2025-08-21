import { NextRequest, NextResponse } from 'next/server';
import { 
  createChatSession, 
  getCustomerChatSessions, 
  getDealerChatSessions,
  getWaitingChatSessions,
  getChatSession,
  updateChatSessionStatus
} from '@/lib/chat';

// 채팅 세션 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const dealerId = searchParams.get('dealerId');
    const sessionId = searchParams.get('sessionId');
    const waiting = searchParams.get('waiting');

    console.log('📋 채팅 세션 조회 API 호출됨:', { customerId, dealerId, sessionId, waiting });

    // 특정 세션 조회
    if (sessionId) {
      const session = await getChatSession(sessionId);
      return NextResponse.json({ session });
    }

    // 대기 중인 세션 조회
    if (waiting === 'true') {
      const sessions = await getWaitingChatSessions();
      return NextResponse.json({ sessions });
    }

    // 고객별 세션 조회
    if (customerId) {
      const sessions = await getCustomerChatSessions(customerId);
      return NextResponse.json({ sessions });
    }

    // 딜러별 세션 조회
    if (dealerId) {
      const sessions = await getDealerChatSessions(dealerId);
      return NextResponse.json({ sessions });
    }

    return NextResponse.json(
      { error: '조회 조건을 지정해주세요.' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('❌ 채팅 세션 조회 실패:', error);
    return NextResponse.json(
      { 
        error: '채팅 세션 조회에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 새 채팅 세션 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, productId, dealerId } = body;

    console.log('🆕 새 채팅 세션 생성 API 호출됨:', { customerId, productId, dealerId });

    if (!customerId || !productId) {
      return NextResponse.json(
        { error: '고객 ID와 상품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const sessionId = await createChatSession(customerId, productId, dealerId);
    
    return NextResponse.json({ 
      success: true, 
      sessionId,
      message: '채팅 세션이 생성되었습니다.' 
    });

  } catch (error: any) {
    console.error('❌ 채팅 세션 생성 실패:', error);
    return NextResponse.json(
      { 
        error: '채팅 세션 생성에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 채팅 세션 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, status, dealerId } = body;

    console.log('🔄 채팅 세션 상태 업데이트 API 호출됨:', { sessionId, status, dealerId });

    if (!sessionId || !status) {
      return NextResponse.json(
        { error: '세션 ID와 상태가 필요합니다.' },
        { status: 400 }
      );
    }

    await updateChatSessionStatus(sessionId, status, dealerId);
    
    return NextResponse.json({ 
      success: true,
      message: '채팅 세션 상태가 업데이트되었습니다.' 
    });

  } catch (error: any) {
    console.error('❌ 채팅 세션 상태 업데이트 실패:', error);
    return NextResponse.json(
      { 
        error: '채팅 세션 상태 업데이트에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

