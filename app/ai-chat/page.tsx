'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Bot, User, MessageCircle, Clock, Star, Package, Tag } from 'lucide-react';
import Image from 'next/image';
import { getPrimaryImageUrl } from '@/utils';
import PageLayout from '@/components/layout/PageLayout';
import { getProductById } from '@/lib/products';
import { Product } from '@/types';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const quickQuestions = [
  '이 상품의 특징과 장점이 무엇인가요?',
  '어떤 공간에 어울리나요?',
  '사이즈와 배치는 어떻게 하나요?',
  '가격 대비 가치는 어떤가요?',
  '관리 방법을 알려주세요'
];

function AiChatContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [productLoading, setProductLoading] = useState(!!productId);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (shouldAutoScroll && chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // 스크롤 위치 감지
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    setShouldAutoScroll(isAtBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, shouldAutoScroll]);

  // 상품 정보 로드
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setMessages([{
          id: '1',
          content: '안녕하세요! 쓸만한 가 AI 상담사입니다. 궁금한 것이 있으시면 언제든지 물어보세요.',
          sender: 'ai',
          timestamp: new Date()
        }]);
        return;
      }

      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        
        if (productData) {
          setMessages([{
            id: '1',
            content: `안녕하세요! 쓸만한 가 AI 상담사입니다. 

${productData.name}에 대해 문의해주셔서 감사합니다. 이 상품에 대한 모든 궁금한 점을 전문적으로 상담해드리겠습니다.

상품의 특징, 어울리는 공간, 사이즈 고려사항, 관리 방법 등 무엇이든 물어보세요!`,
            sender: 'ai',
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('상품 로드 실패:', error);
        setMessages([{
          id: '1',
          content: '상품 정보를 불러오는데 실패했습니다. 일반 상담으로 진행하겠습니다.',
          sender: 'ai',
          timestamp: new Date()
        }]);
      } finally {
        setProductLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          productId: productId
        }),
      });

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI 응답 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '죄송합니다. 일시적으로 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-background" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            {product ? '상품 AI 상담' : 'AI 상담'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            {product ? `${product.name}에 대한 전문 상담` : '24시간 언제든지 궁금한 점을 물어보세요'}
          </motion.p>
        </div>
      </section>

      {/* 상품 정보 카드 (상품 상담인 경우) */}
      {product && (
        <section className="py-6 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>{product.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="w-3 h-3" />
                          <span>재고 {product.stock}개</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600">
                        {product.salePrice.toLocaleString()}원
                      </div>
                      <div className="text-sm text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Chat Interface */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-muted px-6 py-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h3 className="font-medium">쓸만한 가 AI 상담사</h3>
                  <div className="flex items-center space-x-1 text-sm opacity-60">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>온라인</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="h-96 overflow-y-auto p-6 space-y-4"
            >
              {productLoading ? (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-foreground' 
                          : 'bg-muted'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-background" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className={`rounded-lg px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-foreground text-background ml-auto'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <div className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-background/70' : 'opacity-60'
                        }`}>
                          {message.timestamp.toLocaleTimeString('ko-KR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-foreground"
                  disabled={isTyping || productLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping || productLoading}
                  className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Questions */}
      {product && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-lg font-medium mb-4 text-center">자주 묻는 질문</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickQuestion(question)}
                  className="p-3 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left"
                  disabled={isTyping || productLoading}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Info */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl xs:text-xl font-light mb-8">
            더 자세한 상담이 필요하시나요?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-background" />
              </div>
              <h3 className="font-medium mb-2">실시간 채팅</h3>
              <p className="text-sm opacity-70 mb-4">평일 9:00 - 18:00</p>
              <button className="text-sm text-foreground hover:opacity-70">
                채팅 시작하기
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-background" />
              </div>
              <h3 className="font-medium mb-2">전화 상담</h3>
              <p className="text-sm opacity-70 mb-4">1588-1234</p>
              <p className="text-xs opacity-60">평일 9:00 - 18:00</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-background" />
              </div>
              <h3 className="font-medium mb-2">VIP 상담</h3>
              <p className="text-sm opacity-70 mb-4">프리미엄 회원 전용</p>
              <p className="text-xs opacity-60">1:1 맞춤 상담</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default function AiChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AiChatContent />
    </Suspense>
  );
} 