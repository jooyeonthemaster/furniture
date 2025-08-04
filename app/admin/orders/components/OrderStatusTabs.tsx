'use client';

import { motion } from 'framer-motion';
import { 
  ClipboardList, Clock, Package, Truck, 
  CheckCircle, XCircle, RotateCcw 
} from 'lucide-react';

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

interface OrderStatusTabsProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  statusCounts: StatusCounts;
}

const statusTabs = [
  {
    key: 'all' as OrderStatus,
    name: '전체',
    icon: ClipboardList,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    key: 'payment_pending' as OrderStatus,
    name: '결제대기',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    key: 'preparing' as OrderStatus,
    name: '상품준비중',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    key: 'shipped' as OrderStatus,
    name: '배송중',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    key: 'delivered' as OrderStatus,
    name: '배송완료',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    key: 'cancelled' as OrderStatus,
    name: '취소접수',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    key: 'returned' as OrderStatus,
    name: '반품접수',
    icon: RotateCcw,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
];

export function OrderStatusTabs({ 
  currentStatus, 
  onStatusChange, 
  statusCounts 
}: OrderStatusTabsProps) {
  return (
    <div className="bg-background border rounded-lg p-1">
      <div className="flex overflow-x-auto">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.key;
          const count = statusCounts[tab.key] || 0;
          
          return (
            <button
              key={tab.key}
              onClick={() => onStatusChange(tab.key)}
              className={`
                relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap
                ${isActive 
                  ? 'bg-foreground text-background shadow-lg' 
                  : 'hover:bg-muted'
                }
              `}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-background' : tab.color}`} />
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{tab.name}</span>
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${isActive 
                    ? 'bg-background/20 text-background' 
                    : `${tab.bgColor} ${tab.color}`
                  }
                `}>
                  {count}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-foreground rounded-lg -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}