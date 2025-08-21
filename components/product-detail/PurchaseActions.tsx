'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Share2, MessageCircle } from 'lucide-react';
import { Product } from '@/types';

interface PurchaseActionsProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
  onDirectPurchase: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
  wishlistLoading: boolean;
  cartQuantity: number;
  availableStock?: number;
}

export default function PurchaseActions({
  product,
  quantity,
  setQuantity,
  onAddToCart,
  onDirectPurchase,
  onToggleWishlist,
  isInWishlist,
  wishlistLoading,
  cartQuantity,
  availableStock
}: PurchaseActionsProps) {
  const router = useRouter();

  const handleDealerInquiry = () => {
    router.push(`/products/${product.id}/inquiry`);
  };

  // 사용할 재고 수량 결정 (옵션별 재고가 있으면 그것을, 없으면 전체 재고)
  const maxStock = availableStock !== undefined ? availableStock : product.stock;

  return (
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
            onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
            className="px-3 py-2 hover:bg-muted transition-colors"
            disabled={quantity >= maxStock}
          >
            +
          </button>
        </div>
        {maxStock <= 5 && (
          <span className="text-sm text-red-500">
            재고 부족 (남은 수량: {maxStock}개)
          </span>
        )}
      </div>

      <div className="flex space-x-3">
        <button 
          onClick={onAddToCart}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>장바구니 {cartQuantity > 0 && `(${cartQuantity})`}</span>
        </button>
        <button
          onClick={onToggleWishlist}
          disabled={wishlistLoading}
          className={`p-3 rounded-lg border border-border transition-colors ${
            isInWishlist ? 'bg-red-50 text-red-600' : 'hover:bg-muted'
          } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
        <button className="p-3 rounded-lg border border-border hover:bg-muted transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <button 
        onClick={onDirectPurchase}
        className="w-full bg-foreground text-background py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors"
      >
        바로 구매하기
      </button>

      {/* 상품 상담받기 버튼들 */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => router.push(`/ai-chat?productId=${product.id}`)}
          className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>AI 상담</span>
        </button>
        
        <button 
          onClick={handleDealerInquiry}
          className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>딜러 문의</span>
        </button>
      </div>
    </div>
  );
}