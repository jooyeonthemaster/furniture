import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc,
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { ReturnRequest, ReturnStatus } from '@/types';

// Firebase 연결 상태 확인
console.log('🔥 Firebase 연결 상태:', !!db);
console.log('🔥 Firebase 앱 이름:', db?.app?.name);

const RETURNS_COLLECTION = 'returns';
const ORDERS_COLLECTION = 'orders';

// GET: 반품 신청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const isAdmin = searchParams.get('admin') === 'true';

    console.log('📦 반품 목록 조회 API 호출됨');
    console.log('📋 요청 파라미터:', { customerId, orderId, status, isAdmin });

    let q;

    // 관리자가 아닌 경우 고객 ID 필터링 (orderBy 제거하여 인덱스 문제 해결)
    if (!isAdmin && customerId) {
      q = query(
        collection(db, RETURNS_COLLECTION),
        where('customerId', '==', customerId)
      );
    } else {
      // 관리자인 경우 모든 반품 조회
      q = query(collection(db, RETURNS_COLLECTION));
    }

    const querySnapshot = await getDocs(q);
    
    let returns: ReturnRequest[] = [];
    querySnapshot.forEach((doc) => {
      returns.push({
        id: doc.id,
        ...doc.data()
      } as ReturnRequest);
    });

    // 추가 필터링
    if (orderId) {
      returns = returns.filter(returnReq => returnReq.orderId === orderId);
    }
    if (status) {
      returns = returns.filter(returnReq => returnReq.status === status);
    }

    // 클라이언트에서 정렬 (requestedAt 기준 내림차순)
    returns.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    console.log('✅ 반품 목록 조회 성공:', returns.length);

    return NextResponse.json({
      success: true,
      returns,
      count: returns.length
    });

  } catch (error) {
    console.error('❌ 반품 목록 조회 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '반품 목록 조회에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// POST: 새 반품 신청
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📦 반품 신청 API 호출됨');
    console.log('📋 요청 데이터:', JSON.stringify(body, null, 2));

    const {
      orderId,
      customerId,
      items,
      reason,
      description,
      returnMethod,
      images
    } = body;

    console.log('🔍 추출된 필드들:', { orderId, customerId, items: items?.length, reason, description, returnMethod });

    // 필수 필드 검증
    if (!orderId || !customerId || !items || !reason || !description || !returnMethod) {
      console.error('❌ 필수 필드 누락:', { 
        orderId: !!orderId, 
        customerId: !!customerId, 
        items: !!items, 
        reason: !!reason, 
        description: !!description, 
        returnMethod: !!returnMethod 
      });
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 주문 존재 여부 확인
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 주문입니다.' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();

    // 주문 상태 확인 (배송 완료된 주문만 반품 가능)
    if (orderData.status !== 'delivered') {
      return NextResponse.json(
        { success: false, error: `현재 주문 상태(${orderData.status})에서는 반품 신청이 불가능합니다. 배송 완료된 주문만 반품 신청이 가능합니다.` },
        { status: 400 }
      );
    }

    // 결제 상태 확인 (paymentStatus가 있는 경우에만 검증)
    if (orderData.paymentStatus && orderData.paymentStatus !== 'completed') {
      return NextResponse.json(
        { success: false, error: `결제가 완료되지 않은 주문은 반품 신청이 불가능합니다. (현재 결제 상태: ${orderData.paymentStatus})` },
        { status: 400 }
      );
    }

    // 이미 반품/환불된 주문인지 확인
    if (['returned', 'refunded'].includes(orderData.status)) {
      return NextResponse.json(
        { success: false, error: '이미 반품 또는 환불 처리된 주문입니다.' },
        { status: 400 }
      );
    }

    // 이미 반품 신청된 주문인지 확인
    const existingReturnQuery = query(
      collection(db, RETURNS_COLLECTION),
      where('orderId', '==', orderId),
      where('customerId', '==', customerId)
    );
    
    const existingReturnSnapshot = await getDocs(existingReturnQuery);
    
    if (!existingReturnSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: '이미 반품 신청된 주문입니다.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newReturn: Omit<ReturnRequest, 'id'> = {
      orderId,
      customerId,
      items,
      reason,
      description,
      returnMethod,
      status: 'requested',
      requestedAt: now,
      images: images || []
    };

    console.log('🔥 Firestore에 반품 신청 저장 중...');
    console.log('📋 저장할 데이터:', JSON.stringify(newReturn, null, 2));
    console.log('📋 컬렉션 이름:', RETURNS_COLLECTION);
    
    let docRef;
    try {
      docRef = await addDoc(collection(db, RETURNS_COLLECTION), newReturn);
      console.log('✅ Firestore 저장 성공, 문서 ID:', docRef.id);
    } catch (firestoreError) {
      console.error('❌ Firestore 저장 실패:', firestoreError);
      console.error('❌ 오류 코드:', (firestoreError as any)?.code);
      console.error('❌ 오류 메시지:', (firestoreError as any)?.message);
      throw firestoreError;
    }

    // 주문 상태를 'returned'로 업데이트
    try {
      await updateDoc(orderRef, {
        status: 'returned',
        updatedAt: now
      });
      console.log('✅ 주문 상태 업데이트 성공');
    } catch (updateError) {
      console.error('❌ 주문 상태 업데이트 실패:', updateError);
      // 반품 신청은 성공했지만 주문 상태 업데이트 실패는 무시
    }

    console.log('✅ 반품 신청 저장 성공:', docRef.id);

    return NextResponse.json({
      success: true,
      returnId: docRef.id,
      message: '반품 신청이 성공적으로 접수되었습니다.'
    });

  } catch (error) {
    console.error('❌ 반품 신청 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '반품 신청에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// PUT: 반품 상태 업데이트 (관리자용)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📦 반품 상태 업데이트 API 호출됨');
    console.log('📋 요청 데이터:', body);

    const {
      returnId,
      status,
      notes,
      refundAmount
    } = body;

    if (!returnId || !status) {
      return NextResponse.json(
        { success: false, error: 'returnId와 status가 필요합니다.' },
        { status: 400 }
      );
    }

    const returnRef = doc(db, RETURNS_COLLECTION, returnId);
    const returnDoc = await getDoc(returnRef);

    if (!returnDoc.exists()) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 반품 신청입니다.' },
        { status: 404 }
      );
    }

    const updateData: Partial<ReturnRequest> = {
      status: status as ReturnStatus
    };

    const now = new Date().toISOString();

    // 상태에 따른 타임스탬프 업데이트
    if (status === 'approved' || status === 'rejected') {
      updateData.processedAt = now;
    } else if (status === 'completed' || status === 'refunded') {
      updateData.completedAt = now;
    }

    if (notes) {
      updateData.notes = notes;
    }

    if (refundAmount !== undefined) {
      updateData.refundAmount = refundAmount;
    }

    console.log('🔥 Firestore에서 반품 상태 업데이트 중...');
    await updateDoc(returnRef, updateData);

    console.log('✅ 반품 상태 업데이트 성공:', returnId);

    return NextResponse.json({
      success: true,
      message: '반품 상태가 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('❌ 반품 상태 업데이트 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '반품 상태 업데이트에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
