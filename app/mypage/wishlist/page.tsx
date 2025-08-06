'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ArrowLeft, Trash2, Package, Home } from 'lucide-react';
import { Product } from '@/types';
import { getProduct } from '@/lib/products';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증이 완료되었는데 사용자가 없으면 로그인 페이지로 이동
    if (!user) {
      router.push('/register?redirect=/mypage/wishlist');
      return;
    }
  }, [user, router, authLoading]);

  // 찜 목록의 상품 정보 로드
  useEffect(() => {
    const loadProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        return;
      }

      try {
        setProductsLoading(true);
        const productPromises = wishlistItems.map(item => getProduct(item.productId));
        const productResults = await Promise.all(productPromises);
        
        // null이 아닌 상품들만 필터링
        const validProducts = productResults.filter((product): product is Product => product !== null);
        setProducts(validProducts);
      } catch (error) {
        console.error('상품 정보 로드 실패:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [wishlistItems]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      alert(error instanceof Error ? error.message : '찜 목록에서 제거하는데 실패했습니다.');
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      addItem({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || '',
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        maxStock: product.stock,
      });
      
      alert('장바구니에 추가되었습니다.');
    } catch (error) {
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">찜 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/mypage" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5 mr-2" />
            마이페이지로 돌아가기
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light mb-2">찜 목록</h1>
            <p className="text-muted-foreground">
              {products.length > 0 ? `${products.length}개의 상품을 찜했습니다` : '찜한 상품이 없습니다'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span className="text-lg font-medium">{products.length}</span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.images[0] || '/placeholder-image.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  
                  {/* 할인율 배지 */}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                        {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                  
                  {/* 찜 제거 버튼 */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">
                        {product.salePrice.toLocaleString()}원
                      </span>
                      {product.originalPrice > product.salePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 재고 상태 */}
                  <div className="mb-3">
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        재고 {product.stock}개
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                        품절
                      </span>
                    )}
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        product.stock > 0
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>장바구니</span>
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-light mb-4">찜한 상품이 없습니다</h2>
            <p className="text-muted-foreground mb-8">
              마음에 드는 상품을 찜하고 나중에 쉽게 찾아보세요
            </p>
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>상품 둘러보기</span>
            </Link>
          </div>
        )}


      </div>
    </div>
  );
} 