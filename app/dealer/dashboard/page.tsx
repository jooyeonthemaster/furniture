'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  MessageCircle, 
  Star,
  Users,
  Package,
  Clock,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { getDealerChatSessions } from '@/lib/chat';
import { ChatSession, Dealer } from '@/types';
import PageLayout from '@/components/layout/PageLayout';

export default function DealerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealerStats, setDealerStats] = useState<any>(null);

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증이 완료되었는데 사용자가 없거나 딜러가 아니면 리다이렉트
    if (!user) {
      router.push('/register?redirect=/dealer/dashboard');
      return;
    }

    if (user.role !== 'dealer') {
      router.push('/');
      return;
    }

    const fetchDealerData = async () => {
      try {
        setLoading(true);

        // 딜러의 채팅 세션 조회
        const sessions = await getDealerChatSessions(user.id);
        setChatSessions(sessions);

        // 딜러 통계 계산
        const stats = {
          totalChats: sessions.length,
          activeChats: sessions.filter(s => s.status === 'active').length,
          completedChats: sessions.filter(s => s.status === 'completed').length,
          waitingChats: sessions.filter(s => s.status === 'waiting').length,
          todaysChats: sessions.filter(s => {
            const today = new Date();
            const sessionDate = new Date(s.createdAt);
            return sessionDate.toDateString() === today.toDateString();
          }).length,
          // 딜러 정보에서 가져올 수 있는 통계들 (기본값 설정)
          totalSales: (user as any).totalSales || 0,
          totalEarnings: (user as any).totalEarnings || 0,
          commission: (user as any).commission || 10,
          rating: (user as any).rating || 0,
          completedDeals: (user as any).completedDeals || 0
        };

        setDealerStats(stats);
      } catch (error) {
        console.error('딜러 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealerData();
  }, [user, router, authLoading]);

  if (authLoading || loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (!user || user.role !== 'dealer') {
    return null;
  }

  const recentSessions = chatSessions.slice(0, 5);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-wide">딜러 대시보드</h1>
            <p className="text-muted-foreground mt-2">
              안녕하세요, {user.name}님! 오늘도 좋은 하루 되세요.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">수수료율</p>
            <p className="text-2xl font-semibold text-primary">
              {dealerStats?.commission || 10}%
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 매출</p>
                <p className="text-2xl font-semibold">
                  {dealerStats?.totalSales?.toLocaleString() || '0'}원
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">수수료 수익</p>
                <p className="text-2xl font-semibold">
                  {dealerStats?.totalEarnings?.toLocaleString() || '0'}원
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 채팅</p>
                <p className="text-2xl font-semibold">
                  {dealerStats?.activeChats || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">고객 평점</p>
                <p className="text-2xl font-semibold">
                  {dealerStats?.rating?.toFixed(1) || '0.0'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 채팅 현황 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 대기 중인 채팅 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">대기 중인 채팅</h3>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-yellow-600">
              {dealerStats?.waitingChats || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              고객이 응답을 기다리고 있습니다
            </p>
          </motion.div>

          {/* 진행 중인 채팅 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">진행 중인 채팅</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-blue-600">
              {dealerStats?.activeChats || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              현재 상담 중인 고객
            </p>
          </motion.div>

          {/* 완료된 채팅 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">완료된 상담</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-green-600">
              {dealerStats?.completedChats || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              성공적으로 완료된 상담
            </p>
          </motion.div>
        </div>

        {/* 최근 채팅 세션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-background border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">최근 채팅 세션</h3>
            <button className="flex items-center text-sm text-primary hover:underline">
              전체보기
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {recentSessions.length > 0 ? (
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/chat/${session.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        고객 ID: {session.customerId.slice(0, 8)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        상품 ID: {session.productId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                        session.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.status === 'waiting' ? '대기중' :
                         session.status === 'active' ? '진행중' :
                         session.status === 'completed' ? '완료' : '취소됨'}
                      </span>
                    </div>
                    
                    <button className="p-2 hover:bg-background rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">채팅 세션이 없습니다</h4>
              <p className="text-muted-foreground">
                아직 고객과의 채팅 세션이 없습니다.
              </p>
            </div>
          )}
        </motion.div>

        {/* 오늘의 성과 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary/5 to-primary/10 border rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">오늘의 성과</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">오늘 채팅</p>
                  <p className="text-xl font-semibold">
                    {dealerStats?.todaysChats || 0}건
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">완료된 거래</p>
                  <p className="text-xl font-semibold">
                    {dealerStats?.completedDeals || 0}건
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">고객 만족도</p>
                  <p className="text-xl font-semibold">
                    {dealerStats?.rating?.toFixed(1) || '0.0'}/5.0
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
