import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { collection, query, where, onSnapshot, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChatSession } from '@/types';

export function useChatNotifications() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestMessage, setLatestMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    console.log('🔔 채팅 알림 시스템 초기화:', user.id);

    // 사용자의 채팅 세션 실시간 구독
    const q = query(
      collection(db, 'chatSessions'),
      where('customerId', '==', user.id),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('📱 채팅 세션 업데이트 감지');
      
      let totalUnread = 0;
      let newestMessage = null;

      for (const sessionDoc of snapshot.docs) {
        const sessionData = sessionDoc.data();
        
        // 활성 상태인 채팅만 확인
        if (sessionData.status === 'active') {
          try {
            // 해당 세션의 최근 메시지 조회
            const messagesSnapshot = await getDocs(
              query(
                collection(db, `chatSessions/${sessionDoc.id}/messages`),
                orderBy('timestamp', 'desc'),
                limit(1)
              )
            );

            if (!messagesSnapshot.empty) {
              const lastMessage = messagesSnapshot.docs[0].data();
              
              // 딜러가 보낸 메시지인 경우 읽지 않음으로 간주
              if (lastMessage.senderType === 'dealer') {
                totalUnread++;
                
                if (!newestMessage || 
                    lastMessage.timestamp.toDate() > newestMessage.timestamp.toDate()) {
                  newestMessage = lastMessage;
                }
              }
            }
          } catch (error) {
            console.error('메시지 조회 실패:', error);
          }
        }
      }

      setUnreadCount(totalUnread);
      
      if (newestMessage) {
        setLatestMessage(newestMessage.content);
        
        // 브라우저 알림 표시 (권한이 있는 경우)
        if (Notification.permission === 'granted') {
          try {
            new Notification('쓸만한 가 - 새로운 메시지', {
              body: newestMessage.content.slice(0, 100),
              icon: '/icon-192x192.png',
              badge: '/badge-72x72.png',
              tag: 'chat-message',
              renotify: true,
              requireInteraction: true
            });
          } catch (error) {
            console.error('브라우저 알림 표시 실패:', error);
          }
        }
      }
    });

    return () => {
      console.log('🔔 채팅 알림 시스템 해제');
      unsubscribe();
    };
  }, [user]);

  return {
    unreadCount,
    latestMessage
  };
}
