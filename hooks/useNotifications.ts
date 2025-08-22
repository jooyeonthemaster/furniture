import { useState, useEffect, useCallback } from 'react';

interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
  subscription: PushSubscription | null;
}

export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    supported: false,
    subscription: null
  });

  const [loading, setLoading] = useState(false);

  // 브라우저 지원 확인 및 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
      
      setState(prev => ({
        ...prev,
        permission: Notification.permission,
        supported
      }));

      // 기존 구독 확인
      if (supported) {
        checkExistingSubscription();
      }
    }
  }, []);

  // 기존 구독 확인
  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      setState(prev => ({
        ...prev,
        subscription
      }));
    } catch (error) {
      console.error('기존 구독 확인 실패:', error);
    }
  };

  // Service Worker 등록
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker 등록 성공:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker 등록 실패:', error);
        throw error;
      }
    }
    throw new Error('Service Worker를 지원하지 않는 브라우저입니다.');
  };

  // 알림 권한 요청
  const requestPermission = async () => {
    if (!state.supported) {
      throw new Error('이 브라우저는 푸시 알림을 지원하지 않습니다.');
    }

    setLoading(true);
    
    try {
      // Service Worker 등록
      await registerServiceWorker();
      
      // 알림 권한 요청
      const permission = await Notification.requestPermission();
      
      setState(prev => ({
        ...prev,
        permission
      }));

      if (permission === 'granted') {
        await subscribeToPush();
      }

      return permission;
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 푸시 구독
  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID 키 (실제 서비스에서는 환경변수로 관리)
      const vapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLuxazjqAKVXTJtkTXBnLO5EcOqHIHYPTWAaUgpQGhYSyKhzWFJpQo';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      setState(prev => ({
        ...prev,
        subscription
      }));

      // 서버에 구독 정보 전송
      await sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('푸시 구독 실패:', error);
      throw error;
    }
  };

  // 구독 해제
  const unsubscribe = async () => {
    if (state.subscription) {
      try {
        setLoading(true);
        
        await state.subscription.unsubscribe();
        
        setState(prev => ({
          ...prev,
          subscription: null
        }));

        // 서버에서 구독 정보 제거
        await removeSubscriptionFromServer(state.subscription);
        
      } catch (error) {
        console.error('구독 해제 실패:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  // 테스트 알림 전송
  const sendTestNotification = useCallback(async () => {
    if (state.permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        await registration.showNotification('테스트 알림', {
          body: '푸시 알림이 정상적으로 작동합니다!',
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          vibrate: [200, 100, 200],
          data: {
            type: 'test'
          }
        });
      } catch (error) {
        console.error('테스트 알림 전송 실패:', error);
        throw error;
      }
    }
  }, [state.permission]);

  return {
    ...state,
    loading,
    requestPermission,
    unsubscribe,
    sendTestNotification,
    isSubscribed: !!state.subscription
  };
}

// VAPID 키 변환 유틸리티
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 서버에 구독 정보 전송
async function sendSubscriptionToServer(subscription: PushSubscription) {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('서버에 구독 정보 전송 실패');
    }
  } catch (error) {
    console.error('구독 정보 서버 전송 실패:', error);
    // 실패해도 로컬 알림은 작동하도록 함
  }
}

// 서버에서 구독 정보 제거
async function removeSubscriptionFromServer(subscription: PushSubscription) {
  try {
    const response = await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('서버에서 구독 정보 제거 실패');
    }
  } catch (error) {
    console.error('구독 정보 서버 제거 실패:', error);
  }
}


