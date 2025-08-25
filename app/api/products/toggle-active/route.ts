import { NextRequest, NextResponse } from 'next/server';
import { toggleProductActive } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const { productId, active } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (typeof active !== 'boolean') {
      return NextResponse.json(
        { error: '활성화 상태는 boolean 값이어야 합니다.' },
        { status: 400 }
      );
    }

    await toggleProductActive(productId, active);

    return NextResponse.json({
      success: true,
      message: `상품이 ${active ? '활성화' : '비활성화'}되었습니다.`,
      productId,
      active
    });

  } catch (error) {
    console.error('상품 활성화 상태 변경 API 에러:', error);
    return NextResponse.json(
      { 
        error: '상품 활성화 상태 변경에 실패했습니다.',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
