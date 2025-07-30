'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, Search, Filter, MoreHorizontal, Edit, Trash2, 
  Eye, Star, TrendingUp, Package, DollarSign, Copy
} from 'lucide-react';
import { getAllProducts, deleteProduct } from '@/lib/products';
import { Product } from '@/types';
import CategoryFilter from '@/components/admin/CategoryFilter';

// 임시 상품 데이터
const mockProducts = [
  {
    id: '1',
    name: 'Herman Miller Aeron 의자',
    brand: 'Herman Miller',
    category: '의자',
    originalPrice: 1890000,
    salePrice: 567000,
    discount: 70,
    condition: 'A급',
    status: 'active',
    stock: 3,
    views: 1250,
    likes: 89,
    sales: 24,
    image: '/SEATING.jpg',
    createdAt: '2024-01-15',
    featured: true
  },
  {
    id: '2',
    name: 'B&B Italia Charles 소파',
    brand: 'B&B Italia',
    category: '소파',
    originalPrice: 4500000,
    salePrice: 1350000,
    discount: 70,
    condition: 'A급',
    status: 'active',
    stock: 2,
    views: 890,
    likes: 65,
    sales: 18,
    image: '/hero.jpg',
    createdAt: '2024-01-20',
    featured: false
  },
  {
    id: '3',
    name: 'Cassina LC4 샤롱',
    brand: 'Cassina',
    category: '의자',
    originalPrice: 3200000,
    salePrice: 800000,
    discount: 75,
    condition: 'B급',
    status: 'pending',
    stock: 1,
    views: 560,
    likes: 43,
    sales: 12,
    image: '/LIGHTING.jpg',
    createdAt: '2024-01-25',
    featured: true
  }
];

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'active', label: '활성' },
  { value: 'pending', label: '검토 중' },
  { value: 'inactive', label: '비활성' },
  { value: 'sold', label: '판매 완료' }
];



export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Firebase에서 상품 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('상품 로드 실패:', error);
        // 에러 시 목 데이터 사용
        setProducts(mockProducts as any);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all'; // Product 타입에 status 없음, 임시로 모든 상품 표시
    
    // 카테고리 매칭 로직 개선
    let matchesCategory = selectedCategory === 'all';
    if (!matchesCategory && selectedCategory) {
      // 직접 매칭
      matchesCategory = product.category === selectedCategory;
      
      // 레거시 카테고리 매핑
      if (!matchesCategory) {
        const legacyMapping: Record<string, string[]> = {
          'furniture': ['seating', 'tables', 'storage', '의자', '소파', '테이블', '수납'],
          'lighting': ['조명'],
          'accessories': ['decor', '기타'],
          'textile': ['rugs']
        };
        
        const legacyCategories = legacyMapping[selectedCategory] || [];
        matchesCategory = legacyCategories.includes(product.category);
      }
    }
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length 
        ? [] 
        : filteredProducts.map(p => p.id)
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      } catch (error) {
        console.error('상품 삭제 실패:', error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`선택된 ${selectedProducts.length}개 상품을 삭제하시겠습니까?`)) {
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      sold: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      active: '활성',
      pending: '검토 중',
      inactive: '비활성',
      sold: '판매 완료'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const stats = [
    {
      title: '전체 상품',
      value: products.length.toString(),
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: '활성 상품',
      value: products.length.toString(), // status 필드가 없으므로 전체 상품 수로 대체
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: '총 조회수',
      value: products.reduce((sum, p) => sum + p.views, 0).toString(), // sales 대신 views 사용
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: '총 재고',
      value: products.reduce((sum, p) => sum + p.stock, 0).toString(),
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl xs:text-xl font-light">상품 관리</h1>
          <p className="text-muted-foreground">상품을 추가, 수정, 삭제하고 재고를 관리하세요</p>
        </div>
        <Link
          href="/admin/manage/add"
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>상품 추가</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background border rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* 검색바 */}
        <div className="bg-background border rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="상품명 또는 브랜드 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* 선택된 상품 액션 바 */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <span className="text-sm">
              {selectedProducts.length}개 상품이 선택됨
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>선택 삭제</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="text-left p-4 font-medium">상품</th>
                <th className="text-left p-4 font-medium">카테고리</th>
                <th className="text-left p-4 font-medium">가격</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">재고</th>
                <th className="text-left p-4 font-medium">통계</th>
                <th className="text-left p-4 font-medium">등록일</th>
                <th className="text-left p-4 font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t hover:bg-muted/50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.featured && (
                          <div className="absolute top-1 right-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-sm">{product.category}</span>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{product.salePrice.toLocaleString()}원</p>
                      <p className="text-sm text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString()}원
                      </p>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    {getStatusBadge('active')} {/* Product 타입에 status 없으므로 기본값 사용 */}
                  </td>
                  
                  <td className="p-4">
                    <span className={`text-sm ${product.stock <= 1 ? 'text-red-600' : ''}`}>
                      {product.stock}개
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span>{product.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-muted-foreground" />
                        <span>{product.likes}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-2 hover:bg-muted rounded-lg"
                        title="상품 보기"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      
                      <Link
                        href={`/admin/manage/${product.id}/edit`}
                        className="p-2 hover:bg-muted rounded-lg"
                        title="수정"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      
                      <Link
                        href={`/admin/manage/add/copy/${product.id}`}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                        title="복사"
                      >
                        <Copy className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-red-100 text-red-500 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' 
                ? '검색 조건에 맞는 상품이 없습니다.' 
                : '등록된 상품이 없습니다.'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 