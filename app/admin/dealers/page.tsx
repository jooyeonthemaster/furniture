'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  DollarSign,
  TrendingUp,
  MessageCircle,
  Star,
  Phone,
  Mail,
  Building,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { getUsersByRole, updateUser } from '@/lib/users';
import { getChatStats } from '@/lib/chat';
import { User, Dealer } from '@/types';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800'
};

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chatStats, setChatStats] = useState<any>(null);
  const [selectedDealers, setSelectedDealers] = useState<string[]>([]);

  // 딜러 목록 조회
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        setLoading(true);
        console.log('🔍 딜러 목록 조회 시작...');
        
        const dealerUsers = await getUsersByRole('dealer');
        console.log('📋 조회된 딜러 수:', dealerUsers.length);
        
        // 딜러 타입으로 변환 (기본값 설정)
        const dealersWithDefaults = dealerUsers.map(user => ({
          ...user,
          commission: (user as any).commission || 10, // 기본 수수료율 10%
          totalSales: (user as any).totalSales || 0,
          totalEarnings: (user as any).totalEarnings || 0,
          rating: (user as any).rating || 0,
          activeChats: (user as any).activeChats || [],
          completedDeals: (user as any).completedDeals || 0,
          specialties: (user as any).specialties || [],
          bio: (user as any).bio || '',
          profileImage: (user as any).profileImage || ''
        })) as Dealer[];
        
        setDealers(dealersWithDefaults);
      } catch (error) {
        console.error('❌ 딜러 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChatStats = async () => {
      try {
        const stats = await getChatStats();
        setChatStats(stats);
      } catch (error) {
        console.error('❌ 채팅 통계 조회 실패:', error);
      }
    };

    fetchDealers();
    fetchChatStats();
  }, []);

  // 딜러 상태 업데이트
  const updateDealerStatus = async (dealerId: string, isActive: boolean) => {
    try {
      await updateUser(dealerId, { isActive });
      
      setDealers(prev => prev.map(dealer => 
        dealer.id === dealerId 
          ? { ...dealer, isActive }
          : dealer
      ));
      
      console.log(`✅ 딜러 ${dealerId} 상태 업데이트: ${isActive ? '활성' : '비활성'}`);
    } catch (error) {
      console.error('❌ 딜러 상태 업데이트 실패:', error);
    }
  };

  // 필터링된 딜러 목록
  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && dealer.isActive) ||
      (statusFilter === 'inactive' && !dealer.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const stats = {
    totalDealers: dealers.length,
    activeDealers: dealers.filter(d => d.isActive).length,
    totalSales: dealers.reduce((sum, d) => sum + d.totalSales, 0),
    totalEarnings: dealers.reduce((sum, d) => sum + d.totalEarnings, 0),
    averageRating: dealers.length > 0 
      ? dealers.reduce((sum, d) => sum + d.rating, 0) / dealers.length 
      : 0
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
          <h1 className="text-2xl font-light tracking-wide">딜러 관리</h1>
          <p className="text-muted-foreground mt-1">
            딜러 계정을 관리하고 성과를 모니터링하세요
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
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">전체 딜러</p>
              <p className="text-2xl font-semibold">{stats.totalDealers}</p>
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
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">활성 딜러</p>
              <p className="text-2xl font-semibold">{stats.activeDealers}</p>
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
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 매출</p>
              <p className="text-2xl font-semibold">
                {stats.totalSales.toLocaleString()}원
              </p>
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">평균 평점</p>
              <p className="text-2xl font-semibold">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-background border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="딜러 이름 또는 이메일로 검색..."
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
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 딜러 목록 */}
      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">딜러 정보</th>
                <th className="text-left p-4 font-medium">연락처</th>
                <th className="text-left p-4 font-medium">성과</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">가입일</th>
                <th className="text-right p-4 font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredDealers.map((dealer, index) => (
                <motion.tr
                  key={dealer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {dealer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{dealer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          수수료율: {dealer.commission}%
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                        {dealer.email}
                      </div>
                      {dealer.phoneNumber && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                          {dealer.phoneNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <TrendingUp className="w-3 h-3 mr-2 text-muted-foreground" />
                        {dealer.totalSales.toLocaleString()}원
                      </div>
                      <div className="flex items-center text-sm">
                        <MessageCircle className="w-3 h-3 mr-2 text-muted-foreground" />
                        {dealer.completedDeals}건 완료
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-3 h-3 mr-2 text-muted-foreground" />
                        {dealer.rating.toFixed(1)}점
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      dealer.isActive !== false ? statusColors.active : statusColors.inactive
                    }`}>
                      {dealer.isActive !== false ? '활성' : '비활성'}
                    </span>
                  </td>
                  
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(dealer.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => updateDealerStatus(dealer.id, !dealer.isActive)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          dealer.isActive !== false
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {dealer.isActive !== false ? '비활성화' : '활성화'}
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
          
          {filteredDealers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">딜러가 없습니다</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? '검색 조건에 맞는 딜러가 없습니다.' 
                  : '아직 등록된 딜러가 없습니다.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

