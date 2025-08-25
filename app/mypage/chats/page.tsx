'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Package,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { getCustomerChatSessions } from '@/lib/chat';
import { getProductById } from '@/lib/products';
import { ChatSession, Product } from '@/types';
import PageLayout from '@/components/layout/PageLayout';

const statusColors = {
  waiting: 'bg-yellow-100 text-yellow-800',
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  waiting: '대기중',
  active: '진행중',
  completed: '완료',
  cancelled: '취소됨'
};

export default function MyChatsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [products, setProducts] = useState<{[key: string]: Product}>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/register?redirect=/mypage/chats');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 채팅 세션 조회
        const sessions = await getCustomerChatSessions(user.id);
        setChatSessions(sessions);

        // 각 채팅의 상품 정보 조회
        const productIds = [...new Set(sessions.map(s => s.productId))];
        const productData: {[key: string]: Product} = {};
        
        await Promise.all(
          productIds.map(async (productId) => {
            try {
              const product = await getProductById(productId);
              if (product) {
                productData[productId] = product;
              }
            } catch (error) {
              console.error(`상품 ${productId} 조회 실패:`, error);
            }
          })
        );

        setProducts(productData);
      } catch (error) {
        console.error('채팅 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  // 필터링된 채팅 세션
  const filteredSessions = chatSessions.filter(session => {
    const product = products[session.productId];
    const matchesSearch = product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <h1 className="text-2xl font-light tracking-wide">채팅 상담 내역</h1>
            <p className="text-muted-foreground">
              딜러와 나눈 상담 내역을 확인하세요
            </p>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-background border rounded-lg p-4 text-center">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-xl font-semibold">{chatSessions.length}</div>
            <div className="text-sm text-muted-foreground">전체 상담</div>
          </div>
          
          <div className="bg-background border rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-xl font-semibold">
              {chatSessions.filter(s => s.status === 'waiting').length}
            </div>
            <div className="text-sm text-muted-foreground">대기중</div>
          </div>
          
          <div className="bg-background border rounded-lg p-4 text-center">
            <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-xl font-semibold">
              {chatSessions.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">진행중</div>
          </div>
          
          <div className="bg-background border rounded-lg p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-xl font-semibold">
              {chatSessions.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">완료</div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-background border rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="상품명 또는 채팅 ID로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-background border rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">모든 상태</option>
                <option value="waiting">대기중</option>
                <option value="active">진행중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소됨</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 채팅 목록 */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 bg-background border rounded-lg">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">채팅 내역이 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? '검색 조건에 맞는 채팅이 없습니다.' 
                  : '아직 딜러와 상담한 내역이 없습니다.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => router.push('/products')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  상품 둘러보기
                </button>
              )}
            </div>
          ) : (
            filteredSessions.map((session, index) => {
              const product = products[session.productId];
              const lastMessage = session.messages[session.messages.length - 1];
              const isUnread = lastMessage && 
                             lastMessage.senderType === 'dealer' && 
                             session.status === 'active';

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/chat/${session.id}`)}
                  className={`bg-background border rounded-lg p-6 hover:bg-muted/30 transition-colors cursor-pointer ${
                    isUnread ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* 상품 이미지 */}
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {product?.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* 채팅 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[session.status as keyof typeof statusColors]
                          }`}>
                            {statusLabels[session.status as keyof typeof statusLabels]}
                          </span>
                          {isUnread && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>

                      <h3 className="font-medium mb-1 truncate">
                        {product?.name || `상품 ID: ${session.productId.slice(0, 8)}...`}
                      </h3>

                      {product && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.brand} • {product.salePrice.toLocaleString()}원
                        </p>
                      )}

                      {lastMessage && (
                        <div className="bg-muted/50 rounded p-2 mt-3">
                          <p className="text-sm">
                            <span className="font-medium text-primary">
                              {lastMessage.senderType === 'customer' ? '나' : '딜러'}:
                            </span>{' '}
                            <span className="line-clamp-2">{lastMessage.content}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(lastMessage.timestamp).toLocaleString('ko-KR')}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          메시지 {session.messages.length}개
                        </span>
                        {session.status === 'active' && (
                          <span className="text-xs text-blue-600 font-medium">
                            답장 가능
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </PageLayout>
  );
}



