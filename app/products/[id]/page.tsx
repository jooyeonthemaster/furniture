'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Star, Heart, Share2, ArrowLeft, ShoppingBag, Phone, MessageCircle,
  Ruler, Package, Truck, Shield, Award, MapPin, Calendar, Eye,
  ChevronLeft, ChevronRight, Zap, CheckCircle, AlertTriangle,
  Info, Clock, Users, TrendingUp, Download, Plus
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { getProductById, getRelatedProducts } from '@/lib/products';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, getItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedQuantities, setRelatedQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(params.id as string);
        setProduct(productData);
        
        // 연계 상품 로딩
        if (productData?.relatedProducts && productData.relatedProducts.length > 0) {
          setRelatedLoading(true);
          try {
            const relatedData = await getRelatedProducts(productData.relatedProducts);
            setRelatedProducts(relatedData);
          } catch (error) {
            console.error('연계 상품 로드 실패:', error);
          } finally {
            setRelatedLoading(false);
          }
        }
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const handleAddToCart = (product: Product, qty: number = 1) => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || '',
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        maxStock: product.stock,
      });
    }
    alert(`${product.name} ${qty}개가 장바구니에 추가되었습니다!`);
  };

  const updateRelatedQuantity = (productId: string, newQuantity: number) => {
    setRelatedQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, newQuantity)
    }));
  };

  const calculateTotalPrice = () => {
    let total = (product?.salePrice || 0) * quantity;
    
    relatedProducts.forEach(relatedProduct => {
      const qty = relatedQuantities[relatedProduct.id] || 0;
      total += relatedProduct.salePrice * qty;
    });
    
    return total;
  };

  const getSelectedRelatedProducts = () => {
    return relatedProducts.filter(p => (relatedQuantities[p.id] || 0) > 0);
  };

  const addAllToCart = () => {
    // 메인 상품 추가
    handleAddToCart(product!, quantity);
    
    // 선택된 연계 상품들 추가
    const selectedRelated = getSelectedRelatedProducts();
    selectedRelated.forEach(relatedProduct => {
      const qty = relatedQuantities[relatedProduct.id];
      handleAddToCart(relatedProduct, qty);
    });

    alert(`총 ${selectedRelated.length + 1}개 상품이 장바구니에 추가되었습니다!`);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
            <p>상품을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-light mb-4">상품을 찾을 수 없습니다</h2>
            <Link href="/products" className="text-foreground hover:opacity-70">
              상품 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const discountPercentage = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <PageLayout>
      {/* 뒤로가기 버튼 */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </button>
      </div>

      {/* 상품 정보 섹션 */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 상품 이미지 갤러리 */}
          <div className="space-y-4">
            {/* 메인 이미지 */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.images[currentImageIndex] || '/placeholder-image.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* 이미지 네비게이션 */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* 할인 배지 */}
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
                  {discountPercentage}% 할인
                </span>
              </div>
            </div>

            {/* 썸네일 이미지들 */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-foreground' : 'border-border'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-3xl xs:text-2xl font-light mb-4">{product.name}</h1>
              
              {/* 통계 정보 */}
              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>조회 {product.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>좋아요 {product.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span>재고 {product.stock}개</span>
                </div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {product.salePrice.toLocaleString()}원
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString()}원
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(product.originalPrice - product.salePrice).toLocaleString()}원 할인
              </p>
            </div>

            {/* 상품 설명 */}
            {product.description && (
              <div>
                <h3 className="text-lg font-medium mb-3">상품 설명</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* 카테고리 및 태그 */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">카테고리: </span>
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </div>
              
              {/* 구매 버튼들 */}
              <div className="space-y-3 pt-6">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium">수량:</label>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-border">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>장바구니 {getItemQuantity(product?.id || '') > 0 && `(${getItemQuantity(product?.id || '')})`}</span>
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-lg border border-border transition-colors ${
                      isWishlisted ? 'bg-red-50 text-red-600' : 'hover:bg-muted'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <button className="w-full bg-foreground text-background py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors">
                  바로 구매하기
                </button>

                {/* 상품 상담받기 버튼 */}
                <button 
                  onClick={() => router.push(`/ai-chat?productId=${product.id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>AI 상품 상담받기</span>
                </button>
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium">배송 정보</span>
              </div>
              <p className="text-sm text-muted-foreground">무료배송 • 2-3일 소요</p>
              <p className="text-sm text-muted-foreground">설치 서비스 별도 문의</p>
            </div>
          </div>

          {/* 연계 상품 섹션 - 통합 */}
          {relatedProducts.length > 0 && (
            <div className="lg:col-span-2 space-y-6 pt-8 border-t">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-2">함께 구매하면 좋은 상품</h2>
                <p className="text-muted-foreground">이 상품과 잘 어울리는 추천 상품들입니다</p>
              </div>

              {relatedLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <motion.div
                      key={relatedProduct.id}
                      className="group bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -4 }}
                    >
                      <Link href={`/products/${relatedProduct.id}`} className="block">
                        <div className="relative aspect-square bg-muted">
                          <Image
                            src={relatedProduct.images[0] || '/placeholder-image.jpg'}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* 할인 배지 */}
                          {relatedProduct.originalPrice > relatedProduct.salePrice && (
                            <div className="absolute top-2 left-2">
                              <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                                {Math.round(((relatedProduct.originalPrice - relatedProduct.salePrice) / relatedProduct.originalPrice) * 100)}% 할인
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4 space-y-3">
                        <Link href={`/products/${relatedProduct.id}`}>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">{relatedProduct.brand}</p>
                            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedProduct.name}
                            </h3>
                          </div>
                        </Link>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-red-600">
                              {relatedProduct.salePrice.toLocaleString()}원
                            </span>
                            {relatedProduct.originalPrice > relatedProduct.salePrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {relatedProduct.originalPrice.toLocaleString()}원
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 수량 선택 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() => updateRelatedQuantity(relatedProduct.id, (relatedQuantities[relatedProduct.id] || 0) - 1)}
                              className="px-2 py-1 hover:bg-muted transition-colors text-sm"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x border-border text-sm">
                              {relatedQuantities[relatedProduct.id] || 0}
                            </span>
                            <button
                              onClick={() => updateRelatedQuantity(relatedProduct.id, (relatedQuantities[relatedProduct.id] || 0) + 1)}
                              className="px-2 py-1 hover:bg-muted transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(relatedProduct, relatedQuantities[relatedProduct.id] || 1)}
                            disabled={!relatedQuantities[relatedProduct.id]}
                            className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>추가</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 총 금액 계산 섹션 */}
          {(relatedProducts.length > 0 && (getSelectedRelatedProducts().length > 0 || quantity > 0)) && (
            <div className="lg:col-span-2 mt-8 p-6 bg-muted rounded-lg border">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">주문 요약</h3>
                
                {/* 메인 상품 */}
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden">
                      <Image
                        src={product?.images[0] || '/placeholder-image.jpg'}
                        alt={product?.name || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product?.name}</p>
                      <p className="text-xs text-muted-foreground">수량: {quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {((product?.salePrice || 0) * quantity).toLocaleString()}원
                  </span>
                </div>

                {/* 선택된 연계 상품들 */}
                {getSelectedRelatedProducts().map((relatedProduct) => (
                  <div key={relatedProduct.id} className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src={relatedProduct.images[0] || '/placeholder-image.jpg'}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{relatedProduct.name}</p>
                        <p className="text-xs text-muted-foreground">수량: {relatedQuantities[relatedProduct.id]}</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {(relatedProduct.salePrice * relatedQuantities[relatedProduct.id]).toLocaleString()}원
                    </span>
                  </div>
                ))}

                {/* 총 금액 */}
                <div className="flex justify-between items-center pt-4 border-t-2 border-foreground">
                  <span className="text-lg font-bold">총 금액</span>
                  <span className="text-xl font-bold text-red-600">
                    {calculateTotalPrice().toLocaleString()}원
                  </span>
                </div>

                {/* 일괄 장바구니 추가 버튼 */}
                <button
                  onClick={addAllToCart}
                  className="w-full bg-foreground text-background py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    전체 상품 장바구니에 추가 
                    ({1 + getSelectedRelatedProducts().length}개 상품)
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 상세 정보 탭 */}
      <section className="container mx-auto px-4 py-8 border-t">
        <div className="space-y-6">
          <div className="flex border-b">
            {[
              { id: 'overview', label: '개요', icon: Info },
              { id: 'specs', label: '사양', icon: Ruler },
              { id: 'shipping', label: '배송', icon: Truck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="py-6">
            {selectedTab === 'overview' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">상품 개요</h3>
                
                {/* 구조적 개요 표시 (새로운 방식) */}
                {product.overviewDescription || product.overviewImages?.length ? (
                  <div className="space-y-6">
                    {/* 개요 설명 */}
                    {product.overviewDescription && (
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {product.overviewDescription}
                      </div>
                    )}
                    
                    {/* 개요 이미지들 - 세로로 표시 */}
                    {product.overviewImages && product.overviewImages.length > 0 && (
                      <div className="space-y-4">
                        {product.overviewImages.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <div className="relative rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={imageUrl}
                                alt={`${product.name} 개요 이미지 ${index + 1}`}
                                width={800}
                                height={0}
                                className="w-full h-auto object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* 기존 방식 (하위 호환성) */
                  product.description ? (
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  ) : (
                    <p className="text-muted-foreground">상품 설명이 등록되지 않았습니다.</p>
                  )
                )}
              </div>
            )}

            {selectedTab === 'specs' && (
              <div>
                <h3 className="text-xl font-medium mb-4">제품 사양</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">브랜드</span>
                      <span className="text-muted-foreground">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">카테고리</span>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">재고</span>
                      <span className="text-muted-foreground">{product.stock}개</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-medium mb-4">배송 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">무료배송</p>
                      <p className="text-sm text-muted-foreground">전국 어디든 무료로 배송해드립니다</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">2-3일 배송</p>
                      <p className="text-sm text-muted-foreground">주문 후 2-3일 내에 배송됩니다</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">안전 포장</p>
                      <p className="text-sm text-muted-foreground">가구 전용 포장재로 안전하게 배송됩니다</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


    </PageLayout>
  );
} 