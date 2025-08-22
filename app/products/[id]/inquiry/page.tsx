'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  ArrowLeft, 
  User,
  Package,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/components/providers/ClientProviders';
import { getProductById } from '@/lib/products';
import { createChatSession, getCustomerChatSessions } from '@/lib/chat';
import { Product, ChatSession } from '@/types';
import PageLayout from '@/components/layout/PageLayout';
import Image from 'next/image';

export default function DealerInquiryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [existingSessions, setExistingSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');

  const productId = params.id as string;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/register?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 상품 정보 조회
        const productData = await getProductById(productId);
        if (!productData) {
          router.push('/products');
          return;
        }
        setProduct(productData);

        // 기존 채팅 세션 조회
        const sessions = await getCustomerChatSessions(user.id);
        const productSessions = sessions.filter(s => s.productId === productId);
        setExistingSessions(productSessions);

      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, productId, router]);

  const handleCreateInquiry = async () => {
    if (!user || !product || !inquiryMessage.trim()) return;

    try {
      setCreating(true);

      // 새 채팅 세션 생성
      const sessionId = await createChatSession(user.id, product.id);
      
      // 첫 메시지 전송을 위해 채팅 페이지로 이동
      router.push(`/chat/${sessionId}?initialMessage=${encodeURIComponent(inquiryMessage)}`);

    } catch (error) {
      console.error('문의 생성 실패:', error);
      alert('문의 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setCreating(false);
    }
  };

  const handleContinueChat = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
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

  if (!product) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-light mb-4">상품을 찾을 수 없습니다</h2>
          <button 
            onClick={() => router.push('/products')}
            className="text-primary hover:underline"
          >
            상품 목록으로 돌아가기
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-light tracking-wide">딜러 문의하기</h1>
            <p className="text-muted-foreground">
              전문 딜러에게 상품에 대해 문의하세요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상품 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border rounded-lg p-6"
          >
            <h2 className="text-lg font-medium mb-4">문의 상품</h2>
            
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-primary">
                    {product.salePrice.toLocaleString()}원
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 새 문의 작성 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background border rounded-lg p-6"
          >
            <h2 className="text-lg font-medium mb-4">새 문의 작성</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  문의 내용
                </label>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="상품에 대해 궁금한 점을 자세히 적어주세요. 딜러가 빠르게 답변해드립니다."
                  className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleCreateInquiry}
                disabled={!inquiryMessage.trim() || creating}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>문의 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>딜러에게 문의하기</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* 기존 문의 내역 */}
        {existingSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-background border rounded-lg p-6"
          >
            <h2 className="text-lg font-medium mb-4">이 상품에 대한 기존 문의</h2>
            
            <div className="space-y-4">
              {existingSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                          session.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {session.status === 'waiting' && <Clock className="w-3 h-3 mr-1" />}
                          {session.status === 'active' && <User className="w-3 h-3 mr-1" />}
                          {session.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {session.status === 'cancelled' && <AlertCircle className="w-3 h-3 mr-1" />}
                          
                          {session.status === 'waiting' ? '딜러 배정 대기' :
                           session.status === 'active' ? '상담 진행중' :
                           session.status === 'completed' ? '상담 완료' : '상담 취소'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.createdAt).toLocaleDateString('ko-KR')} 생성
                        {session.dealerId && (
                          <span className="ml-2">
                            • 딜러 배정됨
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleContinueChat(session.id)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    {session.status === 'active' ? '채팅 계속하기' : '내역 보기'}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 안내 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-muted/30 border rounded-lg p-6"
        >
          <h3 className="text-lg font-medium mb-4">딜러 문의 안내</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">📞 빠른 응답</h4>
              <p className="text-sm text-muted-foreground">
                전문 딜러가 평균 30분 이내에 답변해드립니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">💡 전문 상담</h4>
              <p className="text-sm text-muted-foreground">
                상품의 상태, 배송, 설치 등 모든 궁금증을 해결해드립니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🔒 안전한 거래</h4>
              <p className="text-sm text-muted-foreground">
                검증된 딜러와의 안전한 거래를 보장합니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">📱 실시간 채팅</h4>
              <p className="text-sm text-muted-foreground">
                실시간 채팅으로 즉시 소통할 수 있습니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}


