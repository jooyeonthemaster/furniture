import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const ORDERS_COLLECTION = 'orders';

// 주문 생성
export async function POST(request: NextRequest) {
  try {
    console.log('📋 주문 생성 API 호출됨');
    const orderData = await request.json();
    console.log('📥 요청 데이터:', orderData);
    
    const {
      customerId,
      items,
      shippingAddress,
      billingAddress,
      notes
    } = orderData;

    if (!customerId || !items || items.length === 0) {
      console.log('❌ 필수 정보 누락:', { customerId, itemsLength: items?.length });
      return NextResponse.json(
        { error: '필수 주문 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 상품 정보 확인
    const productIds = items.map((item: OrderItem) => item.productId);
    const productPromises = productIds.map(async (productId: string) => {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (!productDoc.exists()) {
        throw new Error(`상품 ID ${productId}를 찾을 수 없습니다.`);
      }
      return { id: productDoc.id, ...productDoc.data() };
    });

    const products = await Promise.all(productPromises);

    // 재고 확인 및 차감
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

             // 옵션이 있는 경우 옵션별 재고 확인 및 차감
       if (item.selectedOptions && product.options) {
         for (const [optionId, optionData] of Object.entries(item.selectedOptions)) {
           const option = product.options.find((opt: any) => opt.id === optionId);
           if (option) {
             const value = option.values.find((val: any) => val.id === (optionData as any).valueId);
             if (value && value.stockQuantity !== undefined) {
               if (value.stockQuantity < item.quantity) {
                 throw new Error(`${product.name} - ${(optionData as any).optionName}: ${(optionData as any).valueName} 옵션의 재고가 부족합니다. (재고: ${value.stockQuantity}개)`);
               }
               
               // 옵션별 재고 차감
               value.stockQuantity -= item.quantity;
             }
           }
         }
        
        // 업데이트된 옵션 정보를 상품에 반영
        await updateDoc(doc(db, 'products', item.productId), {
          options: product.options,
          updatedAt: serverTimestamp()
        });
      } else {
        // 일반 재고 확인 및 차감
        if (product.stock < item.quantity) {
          throw new Error(`${product.name}의 재고가 부족합니다. (재고: ${product.stock}개)`);
        }
        
        // 일반 재고 차감
        await updateDoc(doc(db, 'products', item.productId), {
          stock: product.stock - item.quantity,
          updatedAt: serverTimestamp()
        });
      }
    }

    // 주문 총액 계산
    const totalAmount = items.reduce((total: number, item: OrderItem) => {
      const product = products.find(p => p.id === item.productId);
      const itemPrice = product?.salePrice || product?.price || item.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);

    // 배송비 계산 (50,000원 이상 무료배송)
    const shippingFee = totalAmount >= 50000 ? 0 : 2500;
    const finalAmount = totalAmount + shippingFee;

    // 주문 데이터 구성
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    
    const newOrder = {
      orderNumber,
      customerId,
      items: items.map((item: OrderItem) => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product?.salePrice || product?.price || item.price || 0,
          productName: product?.name || 'Unknown Product',
        };
      }),
      status: 'pending',
      totalAmount,
      shippingFee,
      finalAmount,
      shippingAddress: shippingAddress || null,
      billingAddress: billingAddress || null,
      notes: notes || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('💾 저장할 주문 데이터:', newOrder);

    // 주문 저장
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);

    console.log('✅ 주문 생성 성공:', { 
      orderId: docRef.id,
      orderNumber,
      totalAmount: finalAmount 
    });

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
      orderNumber,
      message: '주문이 성공적으로 생성되었습니다.'
    });

  } catch (error: any) {
    console.error('주문 생성 실패:', error);
    return NextResponse.json(
      { 
        error: '주문 생성에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 주문 목록 조회
export async function GET(request: NextRequest) {
  try {
    console.log('📋 주문 목록 조회 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');

    console.log('📋 요청 파라미터:', { customerId, status });

    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('🔥 Firestore 쿼리 실행 중...');

    let q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerId', '==', customerId)
    );
    
    if (status) {
      q = query(
        collection(db, ORDERS_COLLECTION),
        where('customerId', '==', customerId),
        where('status', '==', status)
      );
    }

    // orderBy 제거 - 클라이언트 측에서 정렬
    const querySnapshot = await getDocs(q);

    console.log('📥 쿼리 결과:', { 
      docsCount: querySnapshot.docs.length,
      isEmpty: querySnapshot.empty 
    });

    const orders: Order[] = querySnapshot.docs.map(doc => {
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
    }).sort((a, b) => {
      // 클라이언트 측에서 정렬 (createdAt 기준 내림차순)
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    console.log('✅ 주문 목록 조회 성공:', { 
      ordersCount: orders.length,
      orders: orders.slice(0, 3).map(order => ({ 
        id: order.id, 
        orderNumber: order.orderNumber,
        status: order.status,
        finalAmount: order.finalAmount 
      }))
    });

    return NextResponse.json({ orders });

  } catch (error: any) {
    console.log('주문 조회 실패:', error);
    return NextResponse.json(
      { 
        error: '주문 내역을 불러오는데 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 주문 상태 업데이트
export async function PUT(request: NextRequest) {
  try {
    const { orderId, status, notes } = await request.json();

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
      updatedAt: serverTimestamp(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    await updateDoc(orderRef, updateData);

    console.log('✅ 주문 상태 업데이트 성공:', { orderId, status });

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