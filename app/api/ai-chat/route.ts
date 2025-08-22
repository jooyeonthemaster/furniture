import { NextRequest, NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { getProductById } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const { message, productId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    let systemPrompt = `당신은 쓸만한 가라는 명품 중고 가구 쇼핑몰의 전문 AI 상담사입니다. 
고객의 질문에 친절하고 전문적으로 답변해주세요.

중요: 응답할 때 마크다운 문법을 절대 사용하지 마세요. 볼드체(**)나 제목(##)이나 코드블록이나 리스트(-) 등 마크다운 문법 없이 일반 텍스트로만 답변해주세요.`;

    // 상품 ID가 있는 경우 해당 상품 정보를 컨텍스트로 추가
    if (productId) {
      try {
        const product = await getProductById(productId);
        if (product) {
          systemPrompt += `

현재 고객이 문의하는 상품 정보:
- 상품명: ${product.name}
- 브랜드: ${product.brand}
- 카테고리: ${product.category}
- 정가: ${product.originalPrice.toLocaleString()}원
- 할인가: ${product.salePrice.toLocaleString()}원
- 할인율: ${Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
- 재고: ${product.stock}개
- 상품 설명: ${product.description || '등록된 설명이 없습니다.'}
- 조회수: ${product.views}
- 좋아요: ${product.likes}

이 상품에 대한 구체적이고 전문적인 상담을 제공해주세요. 다음 사항들을 고려해서 답변하세요:
1. 상품의 특징과 장점
2. 어떤 공간에 어울리는지
3. 사이즈와 배치 고려사항
4. 가격 대비 가치
5. 브랜드의 특성
6. 관리 및 사용 팁
7. 배송 및 설치 정보

고객의 라이프스타일과 공간에 맞는 맞춤형 조언을 제공하되, 항상 우리 데이터베이스에 등록된 정확한 정보를 바탕으로 답변해주세요.`;
        }
      } catch (error) {
        console.error('상품 정보 로드 실패:', error);
      }
    }

    const fullPrompt = `${systemPrompt}

고객 질문: ${message}

답변:`;

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const aiMessage = response.text();

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('AI 채팅 API 오류:', error);
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 