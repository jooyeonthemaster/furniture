'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  User,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { useAuth } from '@/components/providers/ClientProviders';
import { 
  getChatSession, 
  sendMessage, 
  subscribeToMessages,
  subscribeToChatSession 
} from '@/lib/chat';
import { getProductById } from '@/lib/products';
import { getUser } from '@/lib/users';
import { ChatSession, Message, Product, User as UserType } from '@/types';
import PageLayout from '@/components/layout/PageLayout';
import Image from 'next/image';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = params.id as string;
  const initialMessage = searchParams.get('initialMessage');

  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/register?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 채팅 세션 조회
        const session = await getChatSession(sessionId);
        if (!session) {
          router.push('/');
          return;
        }

        // 권한 확인 (본인의 채팅만 접근 가능)
        if (session.customerId !== user.id && session.dealerId !== user.id) {
          router.push('/');
          return;
        }

        setChatSession(session);
        setMessages(session.messages);

        // 상품 정보 조회
        if (session.productId) {
          const productData = await getProductById(session.productId);
          setProduct(productData);
        }

        // 상대방 정보 조회
        const otherUserId = session.customerId === user.id ? session.dealerId : session.customerId;
        if (otherUserId) {
          const otherUserData = await getUser(otherUserId);
          setOtherUser(otherUserData);
        }

      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 실시간 메시지 구독
    const unsubscribeMessages = subscribeToMessages(sessionId, (newMessages) => {
      setMessages(newMessages);
    });

    // 채팅 세션 상태 구독
    const unsubscribeSession = subscribeToChatSession(sessionId, (updatedSession) => {
      if (updatedSession) {
        setChatSession(updatedSession);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeSession();
    };
  }, [user, authLoading, sessionId, router]);

  // 초기 메시지 전송
  useEffect(() => {
    if (initialMessage && chatSession && user && !messages.length) {
      handleSendMessage(initialMessage);
      setNewMessage('');
    }
  }, [initialMessage, chatSession, user, messages.length]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || newMessage.trim();
    if (!content || !user || !chatSession || sending) return;

    try {
      setSending(true);
      
      const senderType = user.role === 'dealer' ? 'dealer' : 'customer';
      await sendMessage(sessionId, user.id, senderType, content);
      
      if (!messageContent) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting':
        return { icon: Clock, text: '딜러 배정 대기중', color: 'text-yellow-600' };
      case 'active':
        return { icon: MessageCircle, text: '상담 진행중', color: 'text-blue-600' };
      case 'completed':
        return { icon: CheckCircle, text: '상담 완료', color: 'text-green-600' };
      case 'cancelled':
        return { icon: AlertCircle, text: '상담 취소됨', color: 'text-red-600' };
      default:
        return { icon: MessageCircle, text: status, color: 'text-muted-foreground' };
    }
  };

  if (authLoading || loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (!chatSession) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-light mb-4">채팅을 찾을 수 없습니다</h2>
          <button 
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            홈으로 돌아가기
          </button>
        </div>
      </PageLayout>
    );
  }

  const statusDisplay = getStatusDisplay(chatSession.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              
              <div>
                <h1 className="font-medium">
                  {otherUser ? otherUser.name : (
                    user?.role === 'dealer' ? '고객' : '딜러'
                  )}
                </h1>
                <div className={`flex items-center space-x-1 text-sm ${statusDisplay.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusDisplay.text}</span>
                </div>
              </div>
            </div>
          </div>

          {product && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>문의 상품:</span>
              <span className="font-medium">{product.name}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        {product && (
          <div className="p-4 bg-muted/30 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <p className="text-sm font-semibold text-primary">
                  {product.salePrice.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">대화를 시작해보세요</h3>
              <p className="text-muted-foreground">
                {user?.role === 'dealer' 
                  ? '고객의 질문에 친절하게 답변해주세요.' 
                  : '궁금한 점을 자유롭게 물어보세요.'
                }
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isMyMessage = message.senderId === user?.id;
              const isConsecutive = index > 0 && 
                messages[index - 1].senderId === message.senderId &&
                new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 60000;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                    {!isConsecutive && (
                      <div className={`flex items-center space-x-2 mb-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-muted-foreground">
                          {isMyMessage ? '나' : (otherUser?.name || '상대방')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    
                    <div
                      className={`p-3 rounded-2xl ${
                        isMyMessage
                          ? 'bg-primary text-primary-foreground ml-4'
                          : 'bg-muted mr-4'
                      } ${isConsecutive ? 'mt-1' : 'mt-2'}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex items-end space-x-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="w-full p-3 border border-border rounded-2xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim() || sending}
              className="p-3 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

