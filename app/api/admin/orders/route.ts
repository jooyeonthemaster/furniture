import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';

const ORDERS_COLLECTION = 'orders';

// 관리자용 주문 목록 조회 (모든 주문)
export async function GET(request: NextRequest) {
  try {
    console.log('📋 관리자 주문 목록 조회 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const requestedStatus = searchParams.get('status');

    // 클라이언트 상태를 서버 상태로 매핑
    const statusMapping: { [key: string]: string } = {
      'payment_pending': 'pending',
      'preparing': 'preparing', 
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'returned': 'returned'
    };

    const dbStatus = requestedStatus && requestedStatus !== 'all' 
      ? statusMapping[requestedStatus] || requestedStatus 
      : null;

    console.log('📋 요청 파라미터:', { requestedStatus, dbStatus });

    // 먼저 전체 주문을 조회하여 상태별 카운트 계산
    const allOrdersQuery = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const allOrdersSnapshot = await getDocs(allOrdersQuery);
    
    // 전체 주문으로 Order 객체 생성
    const allOrders: Order[] = allOrdersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        orderNumber: data.orderNumber || `ORD-${doc.id.slice(-8)}`,
        customerId: data.customerId,
        items: data.items || [],
        totalAmount: data.totalAmount || 0,
        shippingFee: data.shippingFee || 0,
        finalAmount: data.finalAmount || data.totalAmount || 0,
        status: data.status || 'pending',
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        paymentKey: data.paymentKey,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        shippingInfo: data.shippingInfo,
        notes: data.notes,
        // Timestamp 처리
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
      } as Order;
    });

    // 상태별 카운트 계산 (전체 주문 기준)
    const statusCounts = {
      all: allOrders.length,
      payment_pending: allOrders.filter(order => order.status === 'pending').length,
      preparing: allOrders.filter(order => order.status === 'preparing').length,
      shipped: allOrders.filter(order => order.status === 'shipped').length,
      delivered: allOrders.filter(order => order.status === 'delivered').length,
      cancelled: allOrders.filter(order => order.status === 'cancelled').length,
      returned: allOrders.filter(order => order.status === 'returned').length,
    };

    // 요청된 상태에 따라 주문 필터링
    const filteredOrders = dbStatus 
      ? allOrders.filter(order => order.status === dbStatus)
      : allOrders;

    console.log('📥 쿼리 결과:', { 
      totalOrdersCount: allOrders.length,
      filteredOrdersCount: filteredOrders.length,
      requestedStatus: requestedStatus,
      dbStatus,
      statusCounts
    });

    console.log('✅ 관리자 주문 목록 조회 성공:', { 
      ordersCount: filteredOrders.length,
      statusCounts
    });

    return NextResponse.json({ 
      orders: filteredOrders,
      statusCounts
    });

  } catch (error: any) {
    console.error('관리자 주문 조회 실패:', error);
    return NextResponse.json(
      { 
        error: '주문 내역을 불러오는데 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 주문 상태 업데이트 (송장번호 포함)
export async function PUT(request: NextRequest) {
  try {
    const { orderId, status, shippingInfo, notes } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'orderId와 status가 필요합니다.' },
        { status: 400 }
      );
    }

    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (shippingInfo) {
      updateData.shippingInfo = shippingInfo;
    }

    if (notes) {
      updateData.notes = notes;
    }

    await updateDoc(orderRef, updateData);

    console.log('✅ 주문 상태 업데이트 성공:', { orderId, status, shippingInfo });

    return NextResponse.json({
      success: true,
      message: '주문 상태가 업데이트되었습니다.'
    });

  } catch (error: any) {
    console.error('주문 상태 업데이트 실패:', error);
    return NextResponse.json(
      { 
        error: '주문 상태 업데이트에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}