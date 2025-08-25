'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Check, X, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  className?: string;
}

export default function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const {
    permission,
    supported,
    loading,
    isSubscribed,
    requestPermission,
    unsubscribe,
    sendTestNotification
  } = useNotifications();

  const [showTest, setShowTest] = useState(false);

  const handleToggleNotifications = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await requestPermission();
      }
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      setShowTest(true);
      setTimeout(() => setShowTest(false), 3000);
    } catch (error) {
      console.error('테스트 알림 실패:', error);
      alert('테스트 알림 전송에 실패했습니다.');
    }
  };

  if (!supported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">알림 기능 미지원</h3>
            <p className="text-sm text-yellow-700">
              현재 브라우저에서는 푸시 알림을 지원하지 않습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: isSubscribed ? Bell : BellOff,
          color: isSubscribed ? 'text-green-600' : 'text-gray-600',
          bgColor: isSubscribed ? 'bg-green-50' : 'bg-gray-50',
          borderColor: isSubscribed ? 'border-green-200' : 'border-gray-200',
          title: isSubscribed ? '알림 활성화됨' : '알림 비활성화됨',
          description: isSubscribed 
            ? '새로운 메시지 알림을 받을 수 있습니다.' 
            : '알림을 받으려면 활성화하세요.'
        };
      case 'denied':
        return {
          icon: X,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: '알림 권한 거부됨',
          description: '브라우저 설정에서 알림 권한을 허용해주세요.'
        };
      default:
        return {
          icon: Bell,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: '알림 설정',
          description: '새로운 메시지 알림을 받으시겠습니까?'
        };
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${status.bgColor} border ${status.borderColor} rounded-lg p-6`}
      >
        <div className="flex items-start space-x-4">
          <div className={`p-3 bg-white rounded-lg ${status.color}`}>
            <StatusIcon className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2">{status.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{status.description}</p>
            
            <div className="flex items-center space-x-3">
              {permission !== 'denied' && (
                <button
                  onClick={handleToggleNotifications}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    isSubscribed
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>처리 중...</span>
                    </div>
                  ) : (
                    isSubscribed ? '알림 끄기' : '알림 켜기'
                  )}
                </button>
              )}
              
              {isSubscribed && (
                <button
                  onClick={handleTestNotification}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  테스트 알림
                </button>
              )}
            </div>

            {showTest && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex items-center space-x-2 text-sm text-green-700"
              >
                <Check className="w-4 h-4" />
                <span>테스트 알림이 전송되었습니다!</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 알림 설정 안내 */}
      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-medium mb-2">알림을 받는 경우:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>딜러가 새로운 메시지를 보낸 경우</li>
          <li>채팅 상태가 변경된 경우 (딜러 배정, 상담 완료 등)</li>
          <li>중요한 공지사항이 있는 경우</li>
        </ul>
      </div>
    </div>
  );
}



