import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';
import { Address } from '@/types';

const ADDRESSES_COLLECTION = 'addresses';

// 주소 목록 조회
export async function GET(request: NextRequest) {
  try {
    console.log('📋 주소 목록 조회 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      console.log('❌ customerId 누락');
      return NextResponse.json(
        { error: 'customerId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('📋 요청 파라미터:', { customerId });

    // Firestore에서 해당 고객의 주소 목록 조회
    console.log('🔥 Firestore 쿼리 실행 중...');
    const addressesQuery = query(
      collection(db, ADDRESSES_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('isDefault', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const addressesSnapshot = await getDocs(addressesQuery);
    console.log('📥 쿼리 결과:', { 
      docsCount: addressesSnapshot.docs.length, 
      isEmpty: addressesSnapshot.empty 
    });

    const addresses = addressesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Address[];

    console.log('✅ 주소 목록 조회 성공:', {
      addressesCount: addresses.length,
      addresses: addresses.map(addr => ({ 
        id: addr.id, 
        label: addr.label, 
        isDefault: addr.isDefault 
      }))
    });

    return NextResponse.json({
      success: true,
      addresses
    });

  } catch (error) {
    console.error('주소 목록 조회 실패:', error);
    return NextResponse.json(
      { error: '주소 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 새 주소 추가
export async function POST(request: NextRequest) {
  try {
    console.log('📋 주소 추가 API 호출됨');
    const addressData = await request.json();
    console.log('📥 요청 데이터:', addressData);

    const {
      customerId,
      recipientName,
      recipientPhone,
      zipCode,
      address,
      detailAddress,
      label,
      isDefault
    } = addressData;

    // 필수 필드 검증
    if (!customerId || !recipientName || !recipientPhone || !zipCode || !address || !label) {
      console.log('❌ 필수 정보 누락:', { 
        customerId: !!customerId,
        recipientName: !!recipientName,
        recipientPhone: !!recipientPhone,
        zipCode: !!zipCode,
        address: !!address,
        label: !!label
      });
      return NextResponse.json(
        { error: '필수 주소 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 기본 주소로 설정하는 경우, 기존 기본 주소 해제
    if (isDefault) {
      console.log('🔄 기존 기본 주소 해제 중...');
      const existingDefaultQuery = query(
        collection(db, ADDRESSES_COLLECTION),
        where('customerId', '==', customerId),
        where('isDefault', '==', true)
      );
      
      const existingDefaultSnapshot = await getDocs(existingDefaultQuery);
      const updatePromises = existingDefaultSnapshot.docs.map(docSnapshot => 
        updateDoc(doc(db, ADDRESSES_COLLECTION, docSnapshot.id), { isDefault: false })
      );
      
      await Promise.all(updatePromises);
      console.log('✅ 기존 기본 주소 해제 완료');
    }

    // 새 주소 데이터 구성
    const newAddress: Omit<Address, 'id'> = {
      customerId,
      recipientName,
      recipientPhone,
      zipCode,
      address,
      detailAddress: detailAddress || '',
      label,
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('💾 저장할 주소 데이터:', newAddress);

    // 주소 저장
    const docRef = await addDoc(collection(db, ADDRESSES_COLLECTION), {
      ...newAddress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ 주소 추가 성공:', { 
      addressId: docRef.id,
      label: newAddress.label,
      isDefault: newAddress.isDefault
    });

    return NextResponse.json({
      success: true,
      addressId: docRef.id,
      message: '주소가 성공적으로 추가되었습니다.'
    });

  } catch (error) {
    console.error('주소 추가 실패:', error);
    return NextResponse.json(
      { error: '주소 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 