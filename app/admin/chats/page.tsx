'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  CheckCircle, 
  X, 
  Search,
  Filter,
  MoreHorizontal,
  User,
  Package,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { getChatStats } from '@/lib/chat';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUsersByRole } from '@/lib/users';
import { ChatSession, Dealer } from '@/types';

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

export default function ChatsPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [assigning, setAssigning] = useState(false);

  // 채팅 세션 목록 조회
  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        setLoading(true);
        console.log('🔍 채팅 세션 목록 조회 시작...');
        
        const q = query(
          collection(db, 'chatSessions'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const sessions = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            messages: [], // 목록에서는 메시지는 로드하지 않음
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            closedAt: data.closedAt?.toDate() || null
          } as ChatSession;
        });
        
        console.log('📋 조회된 채팅 세션 수:', sessions.length);
        setChatSessions(sessions);
      } catch (error) {
        console.error('❌ 채팅 세션 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const chatStats = await getChatStats();
        setStats(chatStats);
      } catch (error) {
        console.error('❌ 채팅 통계 조회 실패:', error);
      }
    };

    const fetchDealers = async () => {
      try {
        const dealerUsers = await getUsersByRole('dealer');
        const activeDealers = dealerUsers.filter(dealer => dealer.isActive !== false);
        setDealers(activeDealers as Dealer[]);
      } catch (error) {
        console.error('❌ 딜러 목록 조회 실패:', error);
      }
    };

    fetchChatSessions();
    fetchStats();
    fetchDealers();
  }, []);

  // 필터링된 채팅 세션 목록
  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = session.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.dealerId && session.dealerId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         session.productId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 딜러 배정 함수
  const handleAssignDealer = async (dealerId: string) => {
    if (!selectedSession || assigning) return;

    try {
      setAssigning(true);
      
      const response = await fetch('/api/chat/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          dealerId: dealerId
        }),
      });

      if (!response.ok) {
        throw new Error('딜러 배정에 실패했습니다.');
      }

      // 성공 시 채팅 세션 목록 새로고침
      const updatedSessions = chatSessions.map(session => 
        session.id === selectedSession.id 
          ? { ...session, dealerId: dealerId, status: 'active' as const }
          : session
      );
      setChatSessions(updatedSessions);

      setShowAssignModal(false);
      setSelectedSession(null);
      
      alert('딜러가 성공적으로 배정되었습니다!');
    } catch (error) {
      console.error('딜러 배정 실패:', error);
      alert('딜러 배정에 실패했습니다.');
    } finally {
      setAssigning(false);
    }
  };

  // 배정 모달 열기
  const openAssignModal = (session: ChatSession) => {
    setSelectedSession(session);
    setShowAssignModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wide">채팅 관리</h1>
          <p className="text-muted-foreground mt-1">
            고객-딜러 간 채팅 세션을 모니터링하고 관리하세요
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 세션</p>
                <p className="text-2xl font-semibold">{stats.totalSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">대기중</p>
                <p className="text-2xl font-semibold">{stats.waitingSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">진행중</p>
                <p className="text-2xl font-semibold">{stats.activeSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">완료</p>
                <p className="text-2xl font-semibold">{stats.completedSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">오늘 세션</p>
                <p className="text-2xl font-semibold">{stats.todaysSessions}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className="bg-background border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="고객 ID, 딜러 ID, 상품 ID로 검색..."
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

      {/* 채팅 세션 목록 */}
      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">세션 정보</th>
                <th className="text-left p-4 font-medium">참여자</th>
                <th className="text-left p-4 font-medium">상품</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">생성일</th>
                <th className="text-left p-4 font-medium">마지막 업데이트</th>
                <th className="text-right p-4 font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, index) => (
                <motion.tr
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="font-mono text-sm">{session.id}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {session.messages?.length || 0}개 메시지
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="w-3 h-3 mr-2 text-muted-foreground" />
                        <span className="font-mono">{session.customerId.slice(0, 8)}...</span>
                      </div>
                      {session.dealerId && (
                        <div className="flex items-center text-sm">
                          <Users className="w-3 h-3 mr-2 text-muted-foreground" />
                          <span className="font-mono">{session.dealerId.slice(0, 8)}...</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center text-sm">
                      <Package className="w-3 h-3 mr-2 text-muted-foreground" />
                      <span className="font-mono">{session.productId.slice(0, 8)}...</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[session.status as keyof typeof statusColors]
                    }`}>
                      {statusLabels[session.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                    <br />
                    <span className="text-xs">
                      {new Date(session.createdAt).toLocaleTimeString('ko-KR')}
                    </span>
                  </td>
                  
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(session.updatedAt).toLocaleDateString('ko-KR')}
                    <br />
                    <span className="text-xs">
                      {new Date(session.updatedAt).toLocaleTimeString('ko-KR')}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      {session.status === 'waiting' && (
                        <button 
                          onClick={() => openAssignModal(session)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                        >
                          딜러 배정
                        </button>
                      )}
                      
                      <button className="px-3 py-1 bg-primary/10 text-primary rounded text-xs font-medium hover:bg-primary/20 transition-colors">
                        상세보기
                      </button>
                      
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">채팅 세션이 없습니다</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? '검색 조건에 맞는 채팅 세션이 없습니다.' 
                  : '아직 생성된 채팅 세션이 없습니다.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 딜러 배정 모달 */}
      {showAssignModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">딜러 배정</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  채팅 세션: {selectedSession.id.slice(0, 8)}...
                </p>
                <p className="text-sm text-muted-foreground">
                  고객 ID: {selectedSession.customerId.slice(0, 8)}...
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  배정할 딜러 선택
                </label>
                
                {dealers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    활성화된 딜러가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {dealers.map((dealer) => (
                      <button
                        key={dealer.id}
                        onClick={() => handleAssignDealer(dealer.id)}
                        disabled={assigning}
                        className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{dealer.name}</p>
                            <p className="text-sm text-muted-foreground">{dealer.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                수수료: {(dealer as any).commission || 10}%
                              </span>
                              <span className="text-xs text-muted-foreground">
                                평점: {((dealer as any).rating || 0).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          
                          {assigning && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  disabled={assigning}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
