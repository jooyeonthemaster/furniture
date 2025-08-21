'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/components/providers/ClientProviders';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { getProductById, getRelatedProducts } from '@/lib/products';
import { Product, SelectedOptions } from '@/types';
import {
  ProductNavigation,
  ProductImageGallery,
  ProductInfo,
  PurchaseActions,
  RelatedProductsSection,
  ProductDetailTabs
} from '@/components/product-detail';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, addItemWithOptions, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [relatedQuantities, setRelatedQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [availableStock, setAvailableStock] = useState<number | undefined>(undefined);

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

  const handleAddToCart = (product: Product, qty: number = 1, options?: SelectedOptions) => {
    // 옵션이 있는 경우 addItemWithOptions 사용, 없으면 기본 addItem 사용
    const cartOptions = options && Object.keys(options).length > 0 
      ? Object.entries(options).reduce((acc, [optionId, valueId]) => {
          // 해당 옵션과 값 정보 찾기
          const option = product.options?.find(opt => opt.id === optionId);
          const value = option?.values.find(val => val.id === valueId);
          
          if (option && value) {
            acc[optionId] = {
              optionName: option.name,
              valueId: value.id,
              valueName: value.value,
              colorCode: value.colorCode,
              priceModifier: value.priceModifier || 0,
            };
          }
          return acc;
        }, {} as any)
      : undefined;

    // 사용할 재고 수량 결정
    const maxStock = availableStock !== undefined ? availableStock : product.stock;

    for (let i = 0; i < qty; i++) {
      if (cartOptions) {
        addItemWithOptions({
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.images[0] || '',
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          maxStock: maxStock,
        }, cartOptions);
      } else {
        addItem({
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.images[0] || '',
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          maxStock: maxStock,
        });
      }
    }
    
    const optionText = cartOptions ? ' (옵션 포함)' : '';
    alert(`${product.name}${optionText} ${qty}개가 장바구니에 추가되었습니다!`);
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

  // 바로 구매하기 함수
  const handleDirectPurchase = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/register?redirect=' + encodeURIComponent(`/products/${params.id}`));
      return;
    }

    if (!product) {
      alert('상품 정보를 불러올 수 없습니다.');
      return;
    }

    // 옵션 정보 처리
    const cartOptions = selectedOptions && Object.keys(selectedOptions).length > 0 
      ? Object.entries(selectedOptions).reduce((acc, [optionId, valueId]) => {
          const option = product.options?.find(opt => opt.id === optionId);
          const value = option?.values.find(val => val.id === valueId);
          
          if (option && value) {
            acc[optionId] = {
              optionName: option.name,
              valueId: value.id,
              valueName: value.value,
              colorCode: value.colorCode,
              priceModifier: value.priceModifier || 0,
            };
          }
          return acc;
        }, {} as any)
      : undefined;

    // 옵션 가격 계산
    const priceModifier = cartOptions ? Object.values(cartOptions).reduce((sum: number, opt: any) => sum + (opt.priceModifier || 0), 0) : 0;
    const finalPrice = product.salePrice + priceModifier;

    // 사용할 재고 수량 결정
    const maxStock = availableStock !== undefined ? availableStock : product.stock;

    // 세션 스토리지에 바로 구매할 상품 정보 저장
    const directPurchaseData = {
      items: [{
        id: `direct-${product.id}-${Date.now()}`, // 고유 ID 생성
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || '',
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        finalPrice: finalPrice,
        maxStock: maxStock,
        quantity,
        selectedOptions: cartOptions,
      }],
      isDirect: true, // 바로 구매 플래그
    };

    sessionStorage.setItem('directPurchase', JSON.stringify(directPurchaseData));
    
    // 결제 페이지로 이동
    router.push('/checkout?direct=true');
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

  return (
    <PageLayout>
      {/* Navigation */}
      <ProductNavigation product={product} />

      {/* 상품 정보 섹션 */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 상품 이미지 갤러리 */}
          <ProductImageGallery 
            images={product.images}
            productName={product.name}
            discountPercentage={discountPercentage}
          />

          {/* 상품 정보 */}
          <div className="space-y-6">
            <ProductInfo 
              product={product} 
              selectedOptions={selectedOptions}
              onOptionsChange={setSelectedOptions}
              onStockChange={setAvailableStock}
            />
            
            <PurchaseActions
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={() => handleAddToCart(product, quantity, selectedOptions)}
              onDirectPurchase={handleDirectPurchase}
              onToggleWishlist={() => product && toggleWishlist(product.id)}
              isInWishlist={product && isInWishlist(product.id)}
              wishlistLoading={wishlistLoading}
              cartQuantity={getItemQuantity(product?.id || '')}
              availableStock={availableStock}
            />
          </div>

          {/* 연계 상품 섹션 */}
          <RelatedProductsSection
            relatedProducts={relatedProducts}
            relatedLoading={relatedLoading}
            relatedQuantities={relatedQuantities}
            updateRelatedQuantity={updateRelatedQuantity}
            handleAddToCart={handleAddToCart}
            mainProduct={product}
            quantity={quantity}
            calculateTotalPrice={calculateTotalPrice}
            addAllToCart={addAllToCart}
          />
        </div>
      </section>

      {/* 상세 정보 탭 */}
      <section className="container mx-auto px-4 py-8 border-t">
        <ProductDetailTabs
          product={product}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </section>
    </PageLayout>
  );
}