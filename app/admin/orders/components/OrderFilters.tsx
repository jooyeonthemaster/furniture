'use client';

import { motion } from 'framer-motion';
import { Calendar, Filter } from 'lucide-react';

interface OrderFiltersProps {
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
}

const dateFilters = [
  { key: 'all', name: '전체 기간' },
  { key: 'today', name: '오늘' },
  { key: 'week', name: '최근 7일' },
  { key: 'month', name: '최근 30일' },
];

export function OrderFilters({ 
  dateFilter, 
  onDateFilterChange 
}: OrderFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-muted rounded-lg p-4 space-y-4"
    >
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4" />
        <h3 className="font-medium">필터 조건</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 날짜 필터 */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>주문 기간</span>
          </label>
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {dateFilters.map((filter) => (
              <option key={filter.key} value={filter.key}>
                {filter.name}
              </option>
            ))}
          </select>
        </div>

        {/* 결제 방법 필터 */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80">
            결제 방법
          </label>
          <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="all">전체</option>
            <option value="toss_card">토스 카드결제</option>
            <option value="toss_simple">토스 간편결제</option>
            <option value="bank_transfer">무통장입금</option>
          </select>
        </div>

        {/* 금액 필터 */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80">
            주문 금액
          </label>
          <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="all">전체</option>
            <option value="under_50000">5만원 미만</option>
            <option value="50000_100000">5만원 ~ 10만원</option>
            <option value="100000_500000">10만원 ~ 50만원</option>
            <option value="over_500000">50만원 이상</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}