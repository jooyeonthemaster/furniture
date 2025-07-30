'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';

interface RelatedProductsSectionProps {
  relatedProducts: Product[];
  relatedLoading: boolean;
  relatedQuantities: Record<string, number>;
  updateRelatedQuantity: (productId: string, newQuantity: number) => void;
  handleAddToCart: (product: Product, qty?: number) => void;
  mainProduct: Product;
  quantity: number;
  calculateTotalPrice: () => number;
  addAllToCart: () => void;
}

export default function RelatedProductsSection({
  relatedProducts,
  relatedLoading,
  relatedQuantities,
  updateRelatedQuantity,
  handleAddToCart,
  mainProduct,
  quantity,
  calculateTotalPrice,
  addAllToCart
}: RelatedProductsSectionProps) {
  const getSelectedRelatedProducts = () => {
    return relatedProducts.filter(p => (relatedQuantities[p.id] || 0) > 0);
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
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

      {/* 총 금액 계산 섹션 */}
      {(getSelectedRelatedProducts().length > 0 || quantity > 0) && (
        <div className="mt-8 p-6 bg-muted rounded-lg border">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">주문 요약</h3>
            
            {/* 메인 상품 */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded overflow-hidden">
                  <Image
                    src={mainProduct?.images[0] || '/placeholder-image.jpg'}
                    alt={mainProduct?.name || ''}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{mainProduct?.name}</p>
                  <p className="text-xs text-muted-foreground">수량: {quantity}</p>
                </div>
              </div>
              <span className="font-medium">
                {((mainProduct?.salePrice || 0) * quantity).toLocaleString()}원
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
  );
}