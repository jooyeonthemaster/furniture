'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, RefreshCw, 
  Package, Truck, CheckCircle, AlertCircle,
  Calendar, User, CreditCard, MapPin
} from 'lucide-react';
import { Order } from '@/types';
import { OrderStatusTabs } from './components/OrderStatusTabs';
import { OrderTable } from './components/OrderTable';
import { OrderFilters } from './components/OrderFilters';

export type OrderStatus = 'all' | 'payment_pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

interface StatusCounts {
  all: number;
  payment_pending: number;
  preparing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('all');
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    all: 0,
    payment_pending: 0,
    preparing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // 주문 목록 조회
  const fetchOrders = async (status: OrderStatus = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== 'all') {
        params.append('status', status);
      }
      
      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) {
        throw new Error('주문 목록 조회에 실패했습니다.');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setStatusCounts(data.statusCounts || statusCounts);
      
    } catch (error) {
      console.error('주문 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchOrders();
  }, []);

  // 상태 변경 시 재조회
  useEffect(() => {
    fetchOrders(currentStatus);
  }, [currentStatus]);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = orders;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 날짜 필터링
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= filterDate
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, dateFilter]);

  // 주문 상태 업데이트
  const handleStatusUpdate = async (orderId: string, newStatus: string, shippingInfo?: any) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          shippingInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('상태 업데이트에 실패했습니다.');
      }

      // 목록 새로고침
      await fetchOrders(currentStatus);
      
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">주문 관리</h1>
          <p className="text-sm opacity-60 mt-1">
            전체 {statusCounts.all}건의 주문을 관리할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchOrders(currentStatus)}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
          
          {/* 엑셀 다운로드 기능 임시 숨김
          <button className="flex items-center space-x-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>엑셀 다운로드</span>
          </button>
          */}
        </div>
      </div>

      {/* 상태 탭 */}
      <OrderStatusTabs
        currentStatus={currentStatus}
        onStatusChange={setCurrentStatus}
        statusCounts={statusCounts}
      />

      {/* 검색 및 필터 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="주문번호, 상품명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-foreground text-background' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>필터</span>
          </button>
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <OrderFilters
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      )}

      {/* 주문 테이블 */}
      <OrderTable
        orders={filteredOrders}
        loading={loading}
        onStatusUpdate={handleStatusUpdate}
        currentStatus={currentStatus}
      />
    </div>
  );
}