'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MoreHorizontal, Edit, Trash2, 
  Users, UserPlus, Eye, MessageSquare, ShoppingBag,
  ArrowUpRight, Calendar, Coins, CreditCard
} from 'lucide-react';
import { User } from '@/types';

// 임시 사용자 데이터 (실제로는 API에서 가져와야 함)
const mockUsers = [
  {
    id: '1',
    name: '양혜리',
    email: 'hyeri070831@gmail.com',
    role: 'customer' as const,
    group: '그룹없음',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    // 추가 정보들
    points: 4800,
    stats: {
      posts: 0,
      comments: 0,
      reviews: 0,
      inquiries: 0
    },
    totalPurchases: 1,
    totalSpent: 42000,
    memo: ''
  },
  {
    id: '2',
    name: '김민서',
    email: 'mseo1031@naver.com',
    role: 'customer' as const,
    group: '그룹없음',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    points: 1000,
    stats: {
      posts: 0,
      comments: 0,
      reviews: 0,
      inquiries: 0
    },
    totalPurchases: 0,
    totalSpent: 0,
    memo: ''
  },
  {
    id: '3',
    name: '박선아',
    email: 'bluebird0522@naver.com',
    role: 'customer' as const,
    group: '그룹없음',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    points: 4800,
    stats: {
      posts: 0,
      comments: 0,
      reviews: 0,
      inquiries: 0
    },
    totalPurchases: 1,
    totalSpent: 42000,
    memo: ''
  },
  {
    id: '4',
    name: '강정',
    email: 'ngh1005@kakao.com',
    role: 'customer' as const,
    group: '그룹없음',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    points: 4800,
    stats: {
      posts: 0,
      comments: 0,
      reviews: 0,
      inquiries: 0
    },
    totalPurchases: 1,
    totalSpent: 42000,
    memo: ''
  },
  {
    id: '5',
    name: '최예은',
    email: 'yeeun7120@gmail.com',
    role: 'customer' as const,
    group: '그룹없음',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    points: 4800,
    stats: {
      posts: 0,
      comments: 0,
      reviews: 0,
      inquiries: 0
    },
    totalPurchases: 1,
    totalSpent: 42000,
    memo: ''
  }
];

const roleOptions = [
  { value: 'all', label: '전체 역할' },
  { value: 'customer', label: '일반회원' },
  { value: 'dealer', label: '딜러' },
  { value: 'admin', label: '관리자' }
];

const groupOptions = [
  { value: 'all', label: '전체 그룹' },
  { value: 'none', label: '그룹없음' },
  { value: 'vip', label: 'VIP' },
  { value: 'premium', label: '프리미엄' }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    customers: 0,
    dealers: 0,
    admins: 0
  });

  // 실제 API에서 데이터 로드
  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 사용자 데이터 로딩 시작...');
      
      const url = new URL('/api/users', window.location.origin);
      if (searchTerm) {
        url.searchParams.set('search', searchTerm);
      }
      if (selectedRole !== 'all') {
        url.searchParams.set('role', selectedRole);
      }
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ 사용자 데이터 로딩 성공:', data);
      
      if (data.users) {
        setUsers(data.users);
      } else {
        console.warn('⚠️ 사용자 데이터가 비어있음');
        setUsers([]);
      }
    } catch (error: any) {
      console.error('❌ 사용자 조회 실패:', error);
      setError(error.message || '사용자 조회에 실패했습니다.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('📊 통계 데이터 로딩 시작...');
      
      const response = await fetch('/api/users?stats=true');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ 통계 데이터 로딩 성공:', data);
      
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('❌ 통계 조회 실패:', error);
    }
  };

  // 검색 및 필터링 효과
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm || selectedRole !== 'all') {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedRole]);

  // 필터링된 사용자 목록 (클라이언트 사이드에서는 필터링 없이 서버에서 필터링된 결과 사용)
  const filteredUsers = users;

  // 역할 표시 배지
  const getRoleBadge = (role: string) => {
    const styles = {
      customer: 'bg-blue-100 text-blue-800',
      dealer: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    };

    const labels = {
      customer: '일반회원',
      dealer: '딜러',
      admin: '관리자'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800'
      }`}>
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  // 체크박스 전체 선택/해제
  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // 개별 체크박스 토글
  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // 사용자 통계 (실제 데이터 사용)
  const statsCards = [
    {
      title: '전체 사용자',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: '일반회원',
      value: stats.customers.toString(),
      icon: UserPlus,
      color: 'bg-green-500'
    },
    {
      title: '딜러',
      value: stats.dealers.toString(),
      icon: CreditCard,
      color: 'bg-purple-500'
    },
    {
      title: '관리자',
      value: stats.admins.toString(),
      icon: Eye,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl xs:text-xl font-light">사용자 관리</h1>
          <p className="text-muted-foreground">
            전체 사용자 {stats.totalUsers}명
            {error && <span className="text-red-500 ml-2">• {error}</span>}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            <UserPlus className="w-4 h-4" />
            <span>사용자 추가</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-500 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+5%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
        >
          {roleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
        >
          {groupOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium w-12">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    onChange={toggleAllUsers}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-4 font-medium">닉네임</th>
                <th className="text-left p-4 font-medium">계정</th>
                <th className="text-left p-4 font-medium">회원 유형</th>
                <th className="text-left p-4 font-medium">그룹</th>
                <th className="text-left p-4 font-medium">가입일</th>
                <th className="text-left p-4 font-medium">적립금</th>
                <th className="text-left p-4 font-medium">글/댓글/구매평/문의</th>
                <th className="text-left p-4 font-medium">누적 구매금액</th>
                <th className="text-left p-4 font-medium">메모</th>
                <th className="text-left p-4 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{user.name}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="p-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      그룹없음
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{user.points?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="text-sm">
                      {user.stats?.posts || 0}/ {user.stats?.comments || 0}/ {user.stats?.reviews || 0}/ {user.stats?.inquiries || 0}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium">
                        {user.totalPurchases || 0}회 {(user.totalSpent || 0).toLocaleString()}원
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      placeholder="메모 입력..."
                      className="w-32 px-2 py-1 text-xs bg-muted rounded border-0 focus:ring-1 focus:ring-primary"
                      defaultValue={user.memo || ''}
                    />
                  </td>
                  <td className="p-4">
                    <div className="relative group">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-background border shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center space-x-2">
                          <Edit className="w-4 h-4" />
                          <span>수정</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center space-x-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={11} className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Users className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-medium mb-2">사용자가 없습니다</h3>
                        <p className="text-muted-foreground mb-4">
                          {error 
                            ? '사용자 데이터를 불러오는데 실패했습니다.' 
                            : '아직 등록된 사용자가 없습니다.'
                          }
                        </p>
                        {error && (
                          <button
                            onClick={() => loadUsers()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                          >
                            다시 시도
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">
                {selectedUsers.length}명 선택됨
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 text-sm">
                그룹 변경
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                선택 삭제
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}