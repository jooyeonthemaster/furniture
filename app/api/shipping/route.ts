import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, query, where, getDocs, getDoc, updateDoc, orderBy } from 'firebase/firestore';

// 배송 정보 타입 정의
interface ShippingInfo {
  id?: string;
  orderId: string;
  customerId: string;
  status: 'preparing' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  trackingNumber?: string;
  carrier?: string; // 택배사
  carrierUrl?: string; // 택배사 추적 URL
  estimatedDelivery?: string;
  actualDelivery?: string;
  shippingAddress: {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address: string;
    detailAddress: string;
  };
  trackingHistory: Array<{
    timestamp: string;
    status: string;
    location?: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// GET: 배송 정보 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');

    console.log('🚚 배송 정보 조회 API 호출됨');
    console.log('📋 요청 파라미터:', { customerId, orderId, status });

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'customerId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('🔥 Firestore 쿼리 실행 중...');
    
    const shippingRef = collection(db, 'shipping');
    let q = query(
      shippingRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );

    // 주문 ID로 필터링
    if (orderId) {
      q = query(
        shippingRef,
        where('customerId', '==', customerId),
        where('orderId', '==', orderId),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    
    let shippingInfos: ShippingInfo[] = [];
    querySnapshot.forEach((doc) => {
      shippingInfos.push({
        id: doc.id,
        ...doc.data()
      } as ShippingInfo);
    });

    // 상태로 필터링 (클라이언트 측)
    if (status) {
      shippingInfos = shippingInfos.filter(info => info.status === status);
    }

    console.log('✅ 배송 정보 조회 성공:', shippingInfos.length);

    return NextResponse.json({
      success: true,
      shipping: shippingInfos,
      count: shippingInfos.length
    });

  } catch (error) {
    console.error('❌ 배송 정보 조회 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '배송 정보 조회에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// PUT: 배송 상태 업데이트 및 추적 정보 추가
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🚚 배송 상태 업데이트 API 호출됨');
    console.log('📋 요청 데이터:', body);

    const {
      shippingId,
      status,
      trackingNumber,
      carrier,
      carrierUrl,
      estimatedDelivery,
      actualDelivery,
      newTrackingEvent
    } = body;

    if (!shippingId) {
      return NextResponse.json(
        { success: false, error: 'shippingId가 필요합니다.' },
        { status: 400 }
      );
    }

    const shippingRef = doc(db, 'shipping', shippingId);
    const shippingDoc = await getDoc(shippingRef);

    if (!shippingDoc.exists()) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 배송 정보입니다.' },
        { status: 404 }
      );
    }

    const currentData = shippingDoc.data() as ShippingInfo;
    const updateData: Partial<ShippingInfo> = {
      updatedAt: new Date().toISOString()
    };

    // 상태 업데이트
    if (status) {
      updateData.status = status;
      
      // 배송 완료 시 실제 배송일 자동 설정
      if (status === 'delivered' && !actualDelivery) {
        updateData.actualDelivery = new Date().toISOString();
      }
    }

    // 추적 정보 업데이트
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (carrier !== undefined) updateData.carrier = carrier;
    if (carrierUrl !== undefined) updateData.carrierUrl = carrierUrl;
    if (estimatedDelivery !== undefined) updateData.estimatedDelivery = estimatedDelivery;
    if (actualDelivery !== undefined) updateData.actualDelivery = actualDelivery;

    // 새 추적 이벤트 추가
    if (newTrackingEvent) {
      const currentHistory = currentData.trackingHistory || [];
      updateData.trackingHistory = [
        ...currentHistory,
        {
          timestamp: new Date().toISOString(),
          ...newTrackingEvent
        }
      ];
    }

    console.log('🔥 Firestore에서 배송 정보 업데이트 중...');
    await updateDoc(shippingRef, updateData);

    console.log('✅ 배송 상태 업데이트 성공:', shippingId);

    return NextResponse.json({
      success: true,
      message: '배송 정보가 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('❌ 배송 상태 업데이트 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '배송 상태 업데이트에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// POST: 새 배송 정보 생성 (주문 생성 시 자동 호출)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🚚 새 배송 정보 생성 API 호출됨');
    console.log('📋 요청 데이터:', body);

    const {
      orderId,
      customerId,
      shippingAddress,
      estimatedDelivery
    } = body;

    // 필수 필드 검증
    if (!orderId || !customerId || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newShipping: Omit<ShippingInfo, 'id'> = {
      orderId,
      customerId,
      status: 'preparing',
      shippingAddress,
      estimatedDelivery: estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 기본 7일 후
      trackingHistory: [
        {
          timestamp: now,
          status: 'preparing',
          description: '주문이 접수되어 상품 준비 중입니다.'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    console.log('🔥 Firestore에 배송 정보 저장 중...');
    const docRef = await addDoc(collection(db, 'shipping'), newShipping);

    console.log('✅ 배송 정보 생성 성공:', docRef.id);

    return NextResponse.json({
      success: true,
      shippingId: docRef.id,
      message: '배송 정보가 성공적으로 생성되었습니다.'
    });

  } catch (error) {
    console.error('❌ 배송 정보 생성 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '배송 정보 생성에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 