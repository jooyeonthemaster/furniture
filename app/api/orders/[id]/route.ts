import { NextRequest, NextResponse } from 'next/server';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OrderStatus, ShippingStatus } from '@/types';

// 특정 주문 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = id;
    
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const orderData = orderSnap.data();
    
    // Timestamp를 문자열로 변환하여 직렬화 가능하게 만듦
    const order = {
      id: orderSnap.id,
      ...orderData,
      createdAt: orderData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: orderData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    };

    return NextResponse.json({ order });

  } catch (error) {
    console.error('주문 조회 실패:', error);
    return NextResponse.json(
      { error: '주문 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 주문 상태 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = id;
    const updateData = await request.json();

    console.log('🔄 주문 상태 업데이트 API 호출됨');
    console.log('📋 주문 ID:', orderId);
    console.log('📥 업데이트 데이터:', updateData);

    // 기존 주문 확인
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.log('❌ 주문을 찾을 수 없음:', orderId);
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 주문 업데이트
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp()
    };

    await updateDoc(orderRef, updatePayload);

    console.log('✅ 주문 상태 업데이트 성공');

    // 업데이트된 주문 정보 반환
    const updatedOrderSnap = await getDoc(orderRef);
    const updatedOrderData = updatedOrderSnap.data();
    
    const updatedOrder = {
      id: updatedOrderSnap.id,
      ...updatedOrderData,
      createdAt: updatedOrderData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: updatedOrderData?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    };

    return NextResponse.json({ 
      message: '주문 상태가 업데이트되었습니다.',
      order: updatedOrder
    });

  } catch (error: any) {
    console.error('❌ 주문 상태 업데이트 실패:', error);
    return NextResponse.json(
      { error: '주문 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 주문 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = id;

    console.log('🗑️ 주문 삭제 API 호출됨');
    console.log('📋 주문 ID:', orderId);

    // 기존 주문 확인
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.log('❌ 주문을 찾을 수 없음:', orderId);
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 주문 삭제
    await deleteDoc(orderRef);

    console.log('✅ 주문 삭제 성공');

    return NextResponse.json({ 
      message: '주문이 삭제되었습니다.'
    });

  } catch (error: any) {
    console.error('❌ 주문 삭제 실패:', error);
    return NextResponse.json(
      { error: '주문 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 