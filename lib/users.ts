import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Order } from '@/types';

const USERS_COLLECTION = 'users';
const ORDERS_COLLECTION = 'orders';

// 사용자별 주문 통계 계산
async function calculateUserOrderStats(userId: string): Promise<{ totalSpent: number; totalPurchases: number }> {
  try {
    console.log(`🔍 사용자 ${userId}의 주문 조회 시작...`);
    
    // 먼저 모든 주문을 조회해서 디버깅
    const allOrdersQuery = query(
      collection(db, ORDERS_COLLECTION),
      where('customerId', '==', userId)
    );
    
    const allOrdersSnapshot = await getDocs(allOrdersQuery);
    console.log(`📋 사용자 ${userId}의 전체 주문 수:`, allOrdersSnapshot.docs.length);
    
    if (allOrdersSnapshot.docs.length > 0) {
      allOrdersSnapshot.docs.forEach(doc => {
        const order = doc.data() as Order;
        console.log(`📦 주문 ${doc.id}:`, {
          status: order.status,
          finalAmount: order.finalAmount,
          orderNumber: order.orderNumber
        });
      });
    }
    
    // 실제 통계 계산 (일단 모든 주문 포함)
    let totalSpent = 0;
    let totalPurchases = 0;
    
    allOrdersSnapshot.docs.forEach(doc => {
      const order = doc.data() as Order;
      // 결제 완료된 주문들만 포함 (상태 조건 완화)
      if (order.status && !['cancelled', 'refunded'].includes(order.status)) {
        // finalAmount가 유효한 숫자인 경우만 포함
        const amount = Number(order.finalAmount);
        if (!isNaN(amount) && amount > 0) {
          totalSpent += amount;
          totalPurchases += 1;
          console.log(`💰 포함된 주문: ${order.orderNumber} - ${amount}원`);
        } else {
          console.log(`⚠️ 제외된 주문 (금액 없음): ${order.orderNumber} - ${order.finalAmount}`);
        }
      }
    });
    
    console.log(`✅ 사용자 ${userId} 최종 통계: ${totalSpent}원, ${totalPurchases}건`);
    return { totalSpent, totalPurchases };
  } catch (error) {
    console.error(`❌ 사용자 ${userId} 주문 통계 계산 실패:`, error);
    return { totalSpent: 0, totalPurchases: 0 };
  }
}

// 모든 사용자 조회 (관리자용)
export async function getAllUsers(): Promise<User[]> {
  try {
    console.log('🔍 Firebase에서 사용자 목록 조회 시작...');
    
    // orderBy 제거 - Firestore 인덱스 에러 방지
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    
    console.log('📊 조회된 사용자 수:', querySnapshot.docs.length);
    
    // 기본 사용자 데이터 매핑
    const usersWithBasicData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('👤 사용자 데이터:', { id: doc.id, email: data.email, name: data.name });
      
      return {
        id: doc.id,
        ...data,
        // Firestore Timestamp를 Date로 변환
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        // 기본값 설정
        points: data.points || 0,
        group: data.group || '그룹없음',
        memo: data.memo || '',
        stats: data.stats || {
          posts: 0,
          comments: 0,
          reviews: 0,
          inquiries: 0
        },
        totalPurchases: 0, // 실제 계산으로 대체됨
        totalSpent: 0, // 실제 계산으로 대체됨
        isActive: data.isActive !== undefined ? data.isActive : true
      };
    }) as User[];

    console.log('💰 각 사용자별 주문 통계 계산 시작...');
    
    // 각 사용자별 실제 주문 통계 계산
    const users = await Promise.all(
      usersWithBasicData.map(async (user) => {
        const orderStats = await calculateUserOrderStats(user.id);
        console.log(`📊 ${user.name} (${user.email}): 누적 ${orderStats.totalSpent.toLocaleString()}원, ${orderStats.totalPurchases}건`);
        return {
          ...user,
          totalSpent: orderStats.totalSpent,
          totalPurchases: orderStats.totalPurchases
        };
      })
    );

    console.log('✅ 주문 통계 계산 완료. 실제 구매 금액 반영됨.');
    
    // 클라이언트 사이드에서 정렬 (최신순)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('✅ 사용자 목록 조회 완료:', users.length, '명');
    return users;
  } catch (error) {
    console.error('❌ 사용자 목록 조회 실패:', error);
    throw new Error('사용자 목록 조회에 실패했습니다.');
  }
}

// 단일 사용자 조회
export async function getUser(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    const data = userSnap.data();
    return {
      id: userSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date()
    } as User;
  } catch (error) {
    console.error('사용자 조회 실패:', error);
    throw new Error('사용자 조회에 실패했습니다.');
  }
}

// 사용자 정보 업데이트
export async function updateUser(userId: string, userData: Partial<User>) {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('사용자 정보 업데이트 실패:', error);
    throw new Error('사용자 정보 업데이트에 실패했습니다.');
  }
}

// 사용자 삭제
export async function deleteUser(userId: string) {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
    
    return true;
  } catch (error) {
    console.error('사용자 삭제 실패:', error);
    throw new Error('사용자 삭제에 실패했습니다.');
  }
}

// 사용자 검색
export async function searchUsers(searchTerm: string): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const allUsers = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        // 기본값 설정
        points: data.points || 0,
        group: data.group || '그룹없음',
        memo: data.memo || '',
        stats: data.stats || { posts: 0, comments: 0, reviews: 0, inquiries: 0 },
        totalPurchases: 0, // 실제 계산으로 대체됨
        totalSpent: 0, // 실제 계산으로 대체됨
        isActive: data.isActive !== undefined ? data.isActive : true
      };
    }) as User[];
    
    // 클라이언트 사이드에서 텍스트 검색
    const filteredUsers = allUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('💰 검색된 사용자들의 주문 통계 계산 시작...');
    
    // 각 사용자별 실제 주문 통계 계산
    const usersWithStats = await Promise.all(
      filteredUsers.map(async (user) => {
        const orderStats = await calculateUserOrderStats(user.id);
        return {
          ...user,
          totalSpent: orderStats.totalSpent,
          totalPurchases: orderStats.totalPurchases
        };
      })
    );
    
    return usersWithStats;
  } catch (error) {
    console.error('사용자 검색 실패:', error);
    throw new Error('사용자 검색에 실패했습니다.');
  }
}

// 역할별 사용자 조회
export async function getUsersByRole(role: string): Promise<User[]> {
  try {
    console.log('🔍 역할별 사용자 조회 시작:', role);
    
    const q = query(
      collection(db, USERS_COLLECTION),
      where('role', '==', role)
    );
    
    const querySnapshot = await getDocs(q);
    
    // 기본 사용자 데이터 매핑
    const usersWithBasicData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        // 기본값 설정
        points: data.points || 0,
        group: data.group || '그룹없음',
        memo: data.memo || '',
        stats: data.stats || {
          posts: 0,
          comments: 0,
          reviews: 0,
          inquiries: 0
        },
        totalPurchases: 0, // 실제 계산으로 대체됨
        totalSpent: 0, // 실제 계산으로 대체됨
        isActive: data.isActive !== undefined ? data.isActive : true
      };
    }) as User[];

    console.log('💰 역할별 사용자 주문 통계 계산 시작...');
    
    // 각 사용자별 실제 주문 통계 계산
    const users = await Promise.all(
      usersWithBasicData.map(async (user) => {
        const orderStats = await calculateUserOrderStats(user.id);
        return {
          ...user,
          totalSpent: orderStats.totalSpent,
          totalPurchases: orderStats.totalPurchases
        };
      })
    );
    
    // 클라이언트 사이드에서 정렬
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('✅ 역할별 사용자 조회 완료:', role, users.length, '명');
    return users;
  } catch (error) {
    console.error('❌ 역할별 사용자 조회 실패:', error);
    throw new Error('역할별 사용자 조회에 실패했습니다.');
  }
}

// 사용자 통계 조회
export async function getUserStats() {
  try {
    console.log('📊 사용자 통계 조회 시작...');
    
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = querySnapshot.docs.map(doc => doc.data());
    
    console.log('📊 통계 계산을 위한 사용자 수:', users.length);
    
    const stats = {
      totalUsers: users.length,
      customers: users.filter(user => user.role === 'customer').length,
      dealers: users.filter(user => user.role === 'dealer').length,
      admins: users.filter(user => user.role === 'admin').length,
      newUsersToday: users.filter(user => {
        const createdAt = user.createdAt?.toDate?.() || new Date(user.createdAt);
        const today = new Date();
        return createdAt.toDateString() === today.toDateString();
      }).length
    };
    
    console.log('✅ 사용자 통계 조회 완료:', stats);
    return stats;
  } catch (error) {
    console.error('❌ 사용자 통계 조회 실패:', error);
    throw new Error('사용자 통계 조회에 실패했습니다.');
  }
}