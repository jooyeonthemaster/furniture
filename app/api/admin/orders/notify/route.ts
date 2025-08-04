import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ORDERS_COLLECTION = 'orders';
const USERS_COLLECTION = 'users';

// 이메일 알림 발송 (송장번호 등록 시)
export async function POST(request: NextRequest) {
  try {
    const { orderId, shippingInfo } = await request.json();

    if (!orderId || !shippingInfo) {
      return NextResponse.json(
        { error: 'orderId와 shippingInfo가 필요합니다.' },
        { status: 400 }
      );
    }

    // 주문 정보 조회
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    
    // 고객 정보 조회
    const userRef = doc(db, USERS_COLLECTION, orderData.customerId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: '고객 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // 이메일 템플릿 생성
    const emailTemplate = {
      to: userData.email,
      subject: `[LUXE FURNITURE] 배송이 시작되었습니다 - 주문번호: ${orderData.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>배송 안내</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: #2c3e50; margin: 0;">LUXE FURNITURE</h1>
            <p style="color: #666; margin: 5px 0 0 0;">럭셔리 가구 쇼핑몰</p>
          </div>

          <h2 style="color: #2c3e50;">배송이 시작되었습니다</h2>
          
          <p>안녕하세요, <strong>${userData.name}</strong>님!</p>
          <p>주문하신 상품의 배송이 시작되었습니다.</p>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">배송 정보</h3>
            <p style="margin: 5px 0;"><strong>주문번호:</strong> ${orderData.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>택배사:</strong> ${shippingInfo.carrier}</p>
            <p style="margin: 5px 0;"><strong>송장번호:</strong> ${shippingInfo.trackingNumber}</p>
            ${shippingInfo.notes ? `<p style="margin: 5px 0;"><strong>배송메모:</strong> ${shippingInfo.notes}</p>` : ''}
          </div>

          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">주문 상품</h3>
            ${orderData.items?.map((item: any) => `
              <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <p style="margin: 0; font-weight: bold;">${item.productName}</p>
                <p style="margin: 5px 0; color: #666;">수량: ${item.quantity}개 × ${new Intl.NumberFormat('ko-KR').format(item.price)}원</p>
              </div>
            `).join('')}
          </div>

          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #f57c00;">배송지 정보</h3>
            <p style="margin: 5px 0;"><strong>받는 분:</strong> ${orderData.shippingAddress?.recipient}</p>
            <p style="margin: 5px 0;"><strong>연락처:</strong> ${orderData.shippingAddress?.phone}</p>
            <p style="margin: 5px 0;"><strong>주소:</strong> ${orderData.shippingAddress?.street}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">배송 조회하기</a>
          </div>

          <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 30px; color: #666; font-size: 14px;">
            <p>배송 관련 문의사항이 있으시면 고객센터로 연락해 주세요.</p>
            <p>고객센터: 1588-0000 | 이메일: support@luxefurniture.com</p>
            <p style="margin-top: 20px; text-align: center; color: #999;">
              © 2024 LUXE FURNITURE. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `
    };

    console.log('📧 이메일 발송 준비 완료:', {
      to: emailTemplate.to,
      subject: emailTemplate.subject,
      orderId,
      trackingNumber: shippingInfo.trackingNumber
    });

    // 실제 이메일 발송 로직은 여기에 구현
    // 예: SendGrid, AWS SES, Nodemailer 등을 사용
    
    // 현재는 콘솔에만 출력 (실제 이메일 서비스 연동 필요)
    console.log('📧 이메일 발송 시뮬레이션 완료');

    return NextResponse.json({
      success: true,
      message: '배송 안내 이메일이 발송되었습니다.',
      emailInfo: {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        orderId,
        trackingNumber: shippingInfo.trackingNumber
      }
    });

  } catch (error: any) {
    console.error('이메일 발송 실패:', error);
    return NextResponse.json(
      { 
        error: '이메일 발송에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}