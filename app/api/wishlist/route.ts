import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  addDoc, 
  deleteDoc,
  getDocs, 
  doc,
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WishlistItem } from '@/types';

const WISHLIST_COLLECTION = 'wishlist';

// 찜 목록 조회
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 찜 목록 조회 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('📋 요청 파라미터:', { userId });

    if (!userId) {
      console.log('❌ userId 누락');
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('🔥 Firestore 쿼리 실행 중...');
    
    const q = query(
      collection(db, WISHLIST_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);

    console.log('📥 쿼리 결과:', { 
      docsCount: querySnapshot.docs.length,
      isEmpty: querySnapshot.empty 
    });

    const wishlistItems: WishlistItem[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        productId: data.productId,
        productName: data.productName,
        price: data.price,
        imageUrl: data.imageUrl,
        addedAt: data.addedAt?.toDate?.()?.toISOString() || data.addedAt
      };
    }).sort((a: any, b: any) => {
      // 클라이언트 측에서 정렬 (addedAt 기준 내림차순)
      const aTime = new Date(a.addedAt).getTime();
      const bTime = new Date(b.addedAt).getTime();
      return bTime - aTime;
    });

    console.log('✅ 찜 목록 조회 성공:', { 
      itemsCount: wishlistItems.length,
      items: wishlistItems.slice(0, 3).map(item => ({ id: item.id, productId: item.productId }))
    });

    return NextResponse.json({ items: wishlistItems });

  } catch (error: any) {
    console.log('❌ 찜 목록 조회 실패:', error);
    console.log('에러 상세:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: '찜 목록을 불러오는데 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 찜 목록에 상품 추가
export async function POST(request: NextRequest) {
  try {
    console.log('➕ 찜 목록 추가 API 호출됨');
    
    const body = await request.json();
    const { userId, productId, productName, price, imageUrl } = body;

    console.log('📋 요청 데이터:', { userId, productId, productName, price });

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId와 productId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 이미 찜한 상품인지 확인
    const existingQuery = query(
      collection(db, WISHLIST_COLLECTION),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );

    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      console.log('⚠️ 이미 찜한 상품');
      return NextResponse.json(
        { error: '이미 찜한 상품입니다.' },
        { status: 409 }
      );
    }

    // 새 찜 항목 추가
    const newWishlistItem = {
      userId,
      productId,
      productName,
      price,
      imageUrl,
      addedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, WISHLIST_COLLECTION), newWishlistItem);

    console.log('✅ 찜 목록 추가 성공:', { id: docRef.id, productId });

    return NextResponse.json({ 
      item: {
        id: docRef.id,
        ...newWishlistItem 
      }
    });

  } catch (error: any) {
    console.log('❌ 찜 목록 추가 실패:', error);
    return NextResponse.json(
      { 
        error: '찜 목록에 추가하는데 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 찜 목록에서 상품 제거
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ 찜 목록 제거 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    console.log('📋 요청 파라미터:', { userId, productId });

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId와 productId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 찜한 상품 찾기
    const q = query(
      collection(db, WISHLIST_COLLECTION),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('⚠️ 찜한 상품을 찾을 수 없음');
      return NextResponse.json(
        { error: '찜한 상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 문서 삭제
    const deletePromises = querySnapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, WISHLIST_COLLECTION, docSnapshot.id))
    );

    await Promise.all(deletePromises);

    console.log('✅ 찜 목록 제거 성공:', { productId });

    return NextResponse.json({ 
      success: true,
      message: '찜 목록에서 제거되었습니다.' 
    });

  } catch (error: any) {
    console.log('❌ 찜 목록 제거 실패:', error);
    return NextResponse.json(
      { 
        error: '찜 목록에서 제거하는데 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 