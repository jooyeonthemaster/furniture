'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Package, Users, TrendingUp, ShoppingBag, Plus, 
  Eye, Heart, Star, DollarSign, ArrowUpRight
} from 'lucide-react';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

// 더미 통계 데이터는 제거하고 실제 데이터를 사용

const quickActions = [
  {
    title: '새 상품 추가',
    description: '새로운 상품을 등록하고 관리하세요',
    href: '/admin/manage/add',
    icon: Plus,
    color: 'bg-primary text-primary-foreground'
  },
  {
    title: '상품 관리',
    description: '기존 상품을 수정하고 관리하세요',
    href: '/admin/manage',
    icon: Package,
    color: 'bg-muted'
  },
  {
    title: '사용자 관리',
    description: '사용자 계정을 관리하세요',
    href: '/admin/users',
    icon: Users,
    color: 'bg-muted'
  },
  {
    title: '통계 보기',
    description: '판매 통계와 분석을 확인하세요',
    href: '/admin/analytics',
    icon: TrendingUp,
    color: 'bg-muted'
  }
];

const recentProducts = [
  {
    id: 1,
    name: 'Herman Miller Aeron 의자',
    brand: 'Herman Miller',
    price: '567,000원',
    status: 'active',
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    name: 'B&B Italia Charles 소파',
    brand: 'B&B Italia',
    price: '1,350,000원',
    status: 'active',
    views: 890,
    likes: 65
  },
  {
    id: 3,
    name: 'Cassina LC4 샤롱',
    brand: 'Cassina',
    price: '800,000원',
    status: 'pending',
    views: 560,
    likes: 43
  }
];

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 실제 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 실제 통계 계산
  const stats = [
    {
      title: '전체 상품',
      value: products.length.toString(),
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: '총 조회수',
      value: products.reduce((sum, p) => sum + p.views, 0).toString(),
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      title: '총 좋아요',
      value: products.reduce((sum, p) => sum + p.likes, 0).toString(),
      change: '+23%',
      trend: 'up',
      icon: Heart,
      color: 'bg-purple-500'
    },
    {
      title: '총 재고',
      value: products.reduce((sum, p) => sum + p.stock, 0).toString(),
      change: '+5%',
      trend: 'up',
      icon: Package,
      color: 'bg-orange-500'
    }
  ];

  // 최근 상품 (실제 데이터)
  const recentProducts = products.slice(0, 3).map(product => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: `${product.salePrice.toLocaleString()}원`,
    status: 'active',
    views: product.views,
    likes: product.likes
  }));

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl xs:text-2xl font-light mb-2">관리자 대시보드</h1>
          <p className="text-muted-foreground">LUXE FURNITURE 시스템을 관리하세요</p>
        </div>
        <Link
          href="/admin/manage/add"
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>상품 추가</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-medium mb-6">빠른 작업</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`block p-6 rounded-lg transition-all duration-200 hover:scale-105 ${action.color}`}
              >
                <action.icon className="w-8 h-8 mb-4" />
                <h3 className="font-medium mb-2">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">최근 상품</h2>
                      <Link href="/admin/manage" className="text-primary hover:underline text-sm">
            전체 보기
          </Link>
        </div>
        <div className="bg-background border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">상품명</th>
                  <th className="text-left p-4 font-medium">브랜드</th>
                  <th className="text-left p-4 font-medium">가격</th>
                  <th className="text-left p-4 font-medium">상태</th>
                  <th className="text-left p-4 font-medium">조회수</th>
                  <th className="text-left p-4 font-medium">좋아요</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="border-t hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {product.brand}
                    </td>
                    <td className="p-4 font-medium">
                      {product.price}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status === 'active' ? '활성' : '대기'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span>{product.views}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-muted-foreground" />
                        <span>{product.likes}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 