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
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { ChatSession, Message, ChatStatus } from '@/types';

const CHAT_SESSIONS_COLLECTION = 'chatSessions';
const MESSAGES_COLLECTION = 'messages';

// 채팅 세션 생성
export async function createChatSession(
  customerId: string, 
  productId: string, 
  dealerId?: string
): Promise<string> {
  try {
    console.log('🆕 새 채팅 세션 생성:', { customerId, productId, dealerId });
    
    const chatSessionData = {
      customerId,
      productId,
      dealerId: dealerId || null,
      status: 'waiting' as ChatStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      closedAt: null
    };

    const docRef = await addDoc(collection(db, CHAT_SESSIONS_COLLECTION), chatSessionData);
    console.log('✅ 채팅 세션 생성 완료:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ 채팅 세션 생성 실패:', error);
    throw new Error('채팅 세션 생성에 실패했습니다.');
  }
}

// 채팅 세션 조회
export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  try {
    const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      return null;
    }
    
    const data = sessionSnap.data();
    
    // 메시지 조회
    const messagesQuery = query(
      collection(db, `${CHAT_SESSIONS_COLLECTION}/${sessionId}/${MESSAGES_COLLECTION}`),
      orderBy('timestamp', 'asc')
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Message[];
    
    return {
      id: sessionSnap.id,
      ...data,
      messages,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      closedAt: data.closedAt?.toDate() || null
    } as ChatSession;
  } catch (error) {
    console.error('❌ 채팅 세션 조회 실패:', error);
    throw new Error('채팅 세션 조회에 실패했습니다.');
  }
}

// 고객의 채팅 세션 목록 조회
export async function getCustomerChatSessions(customerId: string): Promise<ChatSession[]> {
  try {
    console.log('📋 고객 채팅 세션 조회:', customerId);
    
    const q = query(
      collection(db, CHAT_SESSIONS_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const sessions = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // 각 세션의 메시지 조회
        const messagesQuery = query(
          collection(db, `${CHAT_SESSIONS_COLLECTION}/${doc.id}/${MESSAGES_COLLECTION}`),
          orderBy('timestamp', 'asc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(msgDoc => ({
          id: msgDoc.id,
          ...msgDoc.data(),
          timestamp: msgDoc.data().timestamp?.toDate() || new Date()
        })) as Message[];
        
        return {
          id: doc.id,
          ...data,
          messages,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          closedAt: data.closedAt?.toDate() || null
        } as ChatSession;
      })
    );
    
    console.log('✅ 고객 채팅 세션 조회 완료:', sessions.length, '개');
    return sessions;
  } catch (error) {
    console.error('❌ 고객 채팅 세션 조회 실패:', error);
    throw new Error('채팅 세션 조회에 실패했습니다.');
  }
}

// 딜러의 채팅 세션 목록 조회
export async function getDealerChatSessions(dealerId: string): Promise<ChatSession[]> {
  try {
    console.log('📋 딜러 채팅 세션 조회:', dealerId);
    
    const q = query(
      collection(db, CHAT_SESSIONS_COLLECTION),
      where('dealerId', '==', dealerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const sessions = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // 각 세션의 메시지 조회
        const messagesQuery = query(
          collection(db, `${CHAT_SESSIONS_COLLECTION}/${doc.id}/${MESSAGES_COLLECTION}`),
          orderBy('timestamp', 'asc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(msgDoc => ({
          id: msgDoc.id,
          ...msgDoc.data(),
          timestamp: msgDoc.data().timestamp?.toDate() || new Date()
        })) as Message[];
        
        return {
          id: doc.id,
          ...data,
          messages,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          closedAt: data.closedAt?.toDate() || null
        } as ChatSession;
      })
    );
    
    console.log('✅ 딜러 채팅 세션 조회 완료:', sessions.length, '개');
    return sessions;
  } catch (error) {
    console.error('❌ 딜러 채팅 세션 조회 실패:', error);
    throw new Error('채팅 세션 조회에 실패했습니다.');
  }
}

// 대기 중인 채팅 세션 조회 (딜러 배정 대기)
export async function getWaitingChatSessions(): Promise<ChatSession[]> {
  try {
    console.log('⏳ 대기 중인 채팅 세션 조회');
    
    const q = query(
      collection(db, CHAT_SESSIONS_COLLECTION),
      where('status', '==', 'waiting'),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const sessions = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // 각 세션의 메시지 조회
        const messagesQuery = query(
          collection(db, `${CHAT_SESSIONS_COLLECTION}/${doc.id}/${MESSAGES_COLLECTION}`),
          orderBy('timestamp', 'asc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(msgDoc => ({
          id: msgDoc.id,
          ...msgDoc.data(),
          timestamp: msgDoc.data().timestamp?.toDate() || new Date()
        })) as Message[];
        
        return {
          id: doc.id,
          ...data,
          messages,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          closedAt: data.closedAt?.toDate() || null
        } as ChatSession;
      })
    );
    
    console.log('✅ 대기 중인 채팅 세션 조회 완료:', sessions.length, '개');
    return sessions;
  } catch (error) {
    console.error('❌ 대기 중인 채팅 세션 조회 실패:', error);
    throw new Error('대기 중인 채팅 세션 조회에 실패했습니다.');
  }
}

// 메시지 전송
export async function sendMessage(
  sessionId: string,
  senderId: string,
  senderType: 'customer' | 'dealer' | 'ai',
  content: string,
  attachments?: string[]
): Promise<string> {
  try {
    console.log('💬 메시지 전송:', { sessionId, senderId, senderType, content });
    
    const messageData = {
      senderId,
      senderType,
      content,
      attachments: attachments || [],
      timestamp: serverTimestamp()
    };
    
    // 메시지 추가
    const messageRef = await addDoc(
      collection(db, `${CHAT_SESSIONS_COLLECTION}/${sessionId}/${MESSAGES_COLLECTION}`),
      messageData
    );
    
    // 채팅 세션 업데이트 (마지막 업데이트 시간)
    const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ 메시지 전송 완료:', messageRef.id);
    return messageRef.id;
  } catch (error) {
    console.error('❌ 메시지 전송 실패:', error);
    throw new Error('메시지 전송에 실패했습니다.');
  }
}

// 채팅 세션 상태 업데이트
export async function updateChatSessionStatus(
  sessionId: string, 
  status: ChatStatus, 
  dealerId?: string
): Promise<void> {
  try {
    console.log('🔄 채팅 세션 상태 업데이트:', { sessionId, status, dealerId });
    
    const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (dealerId) {
      updateData.dealerId = dealerId;
    }
    
    if (status === 'completed' || status === 'cancelled') {
      updateData.closedAt = serverTimestamp();
    }
    
    await updateDoc(sessionRef, updateData);
    console.log('✅ 채팅 세션 상태 업데이트 완료');
  } catch (error) {
    console.error('❌ 채팅 세션 상태 업데이트 실패:', error);
    throw new Error('채팅 세션 상태 업데이트에 실패했습니다.');
  }
}

// 딜러 배정
export async function assignDealerToChat(sessionId: string, dealerId: string): Promise<void> {
  try {
    console.log('👥 딜러 배정:', { sessionId, dealerId });
    
    await updateChatSessionStatus(sessionId, 'active', dealerId);
    console.log('✅ 딜러 배정 완료');
  } catch (error) {
    console.error('❌ 딜러 배정 실패:', error);
    throw new Error('딜러 배정에 실패했습니다.');
  }
}

// 채팅 세션 실시간 구독
export function subscribeToChatSession(
  sessionId: string,
  callback: (session: ChatSession | null) => void
): Unsubscribe {
  const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
  
  return onSnapshot(sessionRef, async (doc) => {
    if (!doc.exists()) {
      callback(null);
      return;
    }
    
    const data = doc.data();
    
    // 메시지 조회
    const messagesQuery = query(
      collection(db, `${CHAT_SESSIONS_COLLECTION}/${sessionId}/${MESSAGES_COLLECTION}`),
      orderBy('timestamp', 'asc')
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    const messages = messagesSnapshot.docs.map(msgDoc => ({
      id: msgDoc.id,
      ...msgDoc.data(),
      timestamp: msgDoc.data().timestamp?.toDate() || new Date()
    })) as Message[];
    
    const session: ChatSession = {
      id: doc.id,
      ...data,
      messages,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      closedAt: data.closedAt?.toDate() || null
    } as ChatSession;
    
    callback(session);
  });
}

// 메시지 실시간 구독
export function subscribeToMessages(
  sessionId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const messagesQuery = query(
    collection(db, `${CHAT_SESSIONS_COLLECTION}/${sessionId}/${MESSAGES_COLLECTION}`),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Message[];
    
    callback(messages);
  });
}

// 상품별 채팅 세션 조회
export async function getProductChatSessions(productId: string): Promise<ChatSession[]> {
  try {
    console.log('📦 상품별 채팅 세션 조회:', productId);
    
    const q = query(
      collection(db, CHAT_SESSIONS_COLLECTION),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const sessions = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // 각 세션의 메시지 조회
        const messagesQuery = query(
          collection(db, `${CHAT_SESSIONS_COLLECTION}/${doc.id}/${MESSAGES_COLLECTION}`),
          orderBy('timestamp', 'asc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(msgDoc => ({
          id: msgDoc.id,
          ...msgDoc.data(),
          timestamp: msgDoc.data().timestamp?.toDate() || new Date()
        })) as Message[];
        
        return {
          id: doc.id,
          ...data,
          messages,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          closedAt: data.closedAt?.toDate() || null
        } as ChatSession;
      })
    );
    
    console.log('✅ 상품별 채팅 세션 조회 완료:', sessions.length, '개');
    return sessions;
  } catch (error) {
    console.error('❌ 상품별 채팅 세션 조회 실패:', error);
    throw new Error('상품별 채팅 세션 조회에 실패했습니다.');
  }
}

// 채팅 통계 조회
export async function getChatStats() {
  try {
    console.log('📊 채팅 통계 조회 시작');
    
    const querySnapshot = await getDocs(collection(db, CHAT_SESSIONS_COLLECTION));
    const sessions = querySnapshot.docs.map(doc => doc.data());
    
    const stats = {
      totalSessions: sessions.length,
      waitingSessions: sessions.filter(s => s.status === 'waiting').length,
      activeSessions: sessions.filter(s => s.status === 'active').length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      cancelledSessions: sessions.filter(s => s.status === 'cancelled').length,
      todaysSessions: sessions.filter(s => {
        const createdAt = s.createdAt?.toDate?.() || new Date(s.createdAt);
        const today = new Date();
        return createdAt.toDateString() === today.toDateString();
      }).length
    };
    
    console.log('✅ 채팅 통계 조회 완료:', stats);
    return stats;
  } catch (error) {
    console.error('❌ 채팅 통계 조회 실패:', error);
    throw new Error('채팅 통계 조회에 실패했습니다.');
  }
}

