'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  CalendarDays,
  Eye,
  Heart,
  RotateCcw,
  AlertCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  // 매출 데이터
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  
  // 주문 데이터
  totalOrders: number;
  monthlyOrders: number;
  ordersGrowth: number;
  
  // 사용자 데이터
  totalUsers: number;
  monthlyUsers: number;
  usersGrowth: number;
  
  // 상품 데이터
  totalProducts: number;
  activeProducts: number;
  productViews: number;
  
  // 반품 데이터
  totalReturns: number;
  returnRate: number;
  
  // 카테고리별 매출
  categoryRevenue: { category: string; revenue: number; percentage: number }[];
  
  // 월별 매출 추이
  monthlyTrends: { month: string; revenue: number; orders: number }[];
  
  // 최근 주문 상태
  orderStatusStats: { status: string; count: number; percentage: number }[];
  
  // 결제 수단별 통계
  paymentMethodStats: { method: string; count: number; amount: number }[];
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalyticsData = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);

      console.log('📊 통계 데이터 조회 시작...');

      // 병렬로 모든 통계 데이터 조회 (안전한 에러 처리)
      const responses = await Promise.allSettled([
        fetch(`/api/admin/analytics/revenue?range=${dateRange}`),
        fetch(`/api/admin/analytics/orders?range=${dateRange}`),
        fetch(`/api/admin/analytics/users?range=${dateRange}`),
        fetch(`/api/admin/analytics/products?range=${dateRange}`),
        fetch(`/api/admin/analytics/returns?range=${dateRange}`)
      ]);

      // 성공한 응답만 처리
      const [revenueResult, ordersResult, usersResult, productsResult, returnsResult] = responses;
      
      if (revenueResult.status === 'rejected' || ordersResult.status === 'rejected' || 
          usersResult.status === 'rejected' || productsResult.status === 'rejected' || 
          returnsResult.status === 'rejected') {
        console.error('일부 API 요청 실패:', responses);
        throw new Error('일부 통계 데이터 조회에 실패했습니다.');
      }

      const [revenueResponse, ordersResponse, usersResponse, productsResponse, returnsResponse] = [
        revenueResult.value, ordersResult.value, usersResult.value, 
        productsResult.value, returnsResult.value
      ];

      // 응답 상태 확인
      const failedResponses = [revenueResponse, ordersResponse, usersResponse, productsResponse, returnsResponse]
        .filter(response => !response.ok);
      
      if (failedResponses.length > 0) {
        console.error('API 응답 에러:', failedResponses);
        throw new Error(`${failedResponses.length}개의 통계 API 요청이 실패했습니다.`);
      }

      // JSON 파싱도 안전하게 처리
      const dataPromises = await Promise.allSettled([
        revenueResponse.json(),
        ordersResponse.json(),
        usersResponse.json(),
        productsResponse.json(),
        returnsResponse.json()
      ]);

      const [revenueData, ordersData, usersData, productsData, returnsData] = dataPromises.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`데이터 파싱 실패 (${index}):`, result.reason);
          return {}; // 기본값
        }
      });

      const analytics: AnalyticsData = {
        // 매출
        totalRevenue: revenueData.totalRevenue || 0,
        monthlyRevenue: revenueData.monthlyRevenue || 0,
        revenueGrowth: revenueData.growth || 0,
        
        // 주문
        totalOrders: ordersData.totalOrders || 0,
        monthlyOrders: ordersData.monthlyOrders || 0,
        ordersGrowth: ordersData.growth || 0,
        
        // 사용자
        totalUsers: usersData.totalUsers || 0,
        monthlyUsers: usersData.monthlyUsers || 0,
        usersGrowth: usersData.growth || 0,
        
        // 상품
        totalProducts: productsData.totalProducts || 0,
        activeProducts: productsData.activeProducts || 0,
        productViews: productsData.totalViews || 0,
        
        // 반품
        totalReturns: returnsData.totalReturns || 0,
        returnRate: returnsData.returnRate || 0,
        
        // 상세 통계
        categoryRevenue: revenueData.categoryRevenue || [],
        monthlyTrends: revenueData.monthlyTrends || [],
        orderStatusStats: ordersData.statusStats || [],
        paymentMethodStats: revenueData.paymentMethodStats || []
      };

      setAnalyticsData(analytics);
      console.log('✅ 통계 데이터 조회 완료:', analytics);

    } catch (error) {
      console.error('❌ 통계 데이터 조회 실패:', error);
      setError(error instanceof Error ? error.message : '통계 데이터 조회에 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const handleRefresh = () => {
    fetchAnalyticsData(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatPercent = (value: number) => {
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4" />;
    return <div className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">데이터 로드 실패</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => fetchAnalyticsData()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">비즈니스 인사이트</h1>
          <p className="text-muted-foreground mt-1">실시간 비즈니스 성과 및 통계 분석</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
            <option value="90d">최근 90일</option>
            <option value="1y">최근 1년</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            <span>리포트 다운로드</span>
          </button>
        </div>
      </div>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 매출</p>
              <p className="text-2xl font-bold">{formatPrice(analyticsData.totalRevenue)}원</p>
              <div className={`flex items-center space-x-1 mt-1 ${getGrowthColor(analyticsData.revenueGrowth)}`}>
                {getGrowthIcon(analyticsData.revenueGrowth)}
                <span className="text-sm font-medium">{formatPercent(analyticsData.revenueGrowth)}</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 주문</p>
              <p className="text-2xl font-bold">{formatPrice(analyticsData.totalOrders)}건</p>
              <div className={`flex items-center space-x-1 mt-1 ${getGrowthColor(analyticsData.ordersGrowth)}`}>
                {getGrowthIcon(analyticsData.ordersGrowth)}
                <span className="text-sm font-medium">{formatPercent(analyticsData.ordersGrowth)}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">고객 수</p>
              <p className="text-2xl font-bold">{formatPrice(analyticsData.totalUsers)}명</p>
              <div className={`flex items-center space-x-1 mt-1 ${getGrowthColor(analyticsData.usersGrowth)}`}>
                {getGrowthIcon(analyticsData.usersGrowth)}
                <span className="text-sm font-medium">{formatPercent(analyticsData.usersGrowth)}</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">반품률</p>
              <p className="text-2xl font-bold">{analyticsData.returnRate.toFixed(1)}%</p>
              <div className="flex items-center space-x-1 mt-1 text-gray-600">
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">{analyticsData.totalReturns}건</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 월별 매출 추이 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">월별 매출 추이</h3>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.slice(0, 6).map((trend, index) => (
              <div key={trend.month} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{trend.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">{formatPrice(trend.revenue)}원</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((trend.revenue / Math.max(...analyticsData.monthlyTrends.map(t => t.revenue))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 카테고리별 매출 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">카테고리별 매출</h3>
          <div className="space-y-4">
            {analyticsData.categoryRevenue.slice(0, 5).map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{category.category}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">{formatPrice(category.revenue)}원</span>
                  <span className="text-xs text-muted-foreground">({category.percentage.toFixed(1)}%)</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 하단 통계 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 주문 상태 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">주문 상태 분포</h3>
          <div className="space-y-3">
            {analyticsData.orderStatusStats.map((status, index) => (
              <div key={status.status} className="flex items-center justify-between">
                <span className="text-sm">{status.status}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{status.count}건</span>
                  <span className="text-xs text-muted-foreground">({status.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 결제 수단 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">결제 수단별 통계</h3>
          <div className="space-y-3">
            {analyticsData.paymentMethodStats.map((method, index) => (
              <div key={method.method} className="flex items-center justify-between">
                <span className="text-sm">{method.method}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{method.count}건</span>
                  <span className="text-xs text-muted-foreground">{formatPrice(method.amount)}원</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 상품 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">상품 현황</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm">총 상품</span>
              </div>
              <span className="font-medium">{formatPrice(analyticsData.totalProducts)}개</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-green-600" />
                <span className="text-sm">활성 상품</span>
              </div>
              <span className="font-medium">{formatPrice(analyticsData.activeProducts)}개</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-sm">총 조회수</span>
              </div>
              <span className="font-medium">{formatPrice(analyticsData.productViews)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
