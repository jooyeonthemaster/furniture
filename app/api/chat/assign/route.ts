import { NextRequest, NextResponse } from 'next/server';
import { assignDealerToChat } from '@/lib/chat';

// 딜러 배정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, dealerId } = body;

    console.log('👥 딜러 배정 API 호출됨:', { sessionId, dealerId });

    if (!sessionId || !dealerId) {
      return NextResponse.json(
        { error: '세션 ID와 딜러 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await assignDealerToChat(sessionId, dealerId);
    
    return NextResponse.json({ 
      success: true,
      message: '딜러가 배정되었습니다.' 
    });

  } catch (error: any) {
    console.error('❌ 딜러 배정 실패:', error);
    return NextResponse.json(
      { 
        error: '딜러 배정에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

