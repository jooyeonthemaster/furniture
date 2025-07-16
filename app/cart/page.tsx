'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Heart, Gift } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/components/providers/ClientProviders';
import PageLayout from '@/components/layout/PageLayout';

export default function CartPage() {
  const { items, totalAmount, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');

  // 배송비 계산 (10만원 이상 무료배송)
  const shippingCost = totalAmount >= 100000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingCost;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <PageLayout>
        <section className="py-16 xs:py-12 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 opacity-60" />
              </div>
              <h1 className="text-2xl xs:text-xl font-light mb-4">장바구니가 비어있습니다</h1>
              <p className="opacity-70 mb-8">원하는 상품을 장바구니에 담아보세요</p>
              <Link 
                href="/" 
                className="inline-block px-8 py-3 bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                쇼핑 계속하기
              </Link>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            장바구니
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70"
          >
            총 {totalItems}개의 상품이 담겨있습니다
          </motion.p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-background border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">장바구니 상품</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>전체 삭제</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <div className="w-20 h-20 bg-muted rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs opacity-60 mb-1">{item.brand}</p>
                            <h3 className="font-medium text-sm">{item.name}</h3>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 opacity-60" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.salePrice.toLocaleString()}원</span>
                            {item.originalPrice > item.salePrice && (
                              <span className="text-xs opacity-60 line-through">
                                {item.originalPrice.toLocaleString()}원
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                              disabled={item.quantity >= item.maxStock}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs opacity-60">
                            소계: {(item.salePrice * item.quantity).toLocaleString()}원
                          </span>
                          {item.quantity >= item.maxStock && (
                            <span className="text-xs text-red-600">최대 수량입니다</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-background border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-6">주문 요약</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{totalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">무료</span>
                      ) : (
                        `${shippingCost.toLocaleString()}원`
                      )}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-xs text-green-600">10만원 이상 구매 시 무료배송</p>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>총 결제 금액</span>
                    <span>{finalAmount.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">프로모션 코드</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="코드를 입력하세요"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                    <button className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
                      적용
                    </button>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  {user ? (
                    <Link
                      href="/checkout"
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-foreground text-background hover:opacity-90 transition-opacity"
                    >
                      <span>결제하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/register?redirect=/checkout"
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-foreground text-background hover:opacity-90 transition-opacity"
                    >
                      <span>로그인 후 결제하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  
                  <Link
                    href="/"
                    className="w-full text-center py-3 border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    쇼핑 계속하기
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="text-xs opacity-60 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>찜 목록에 저장된 상품도 확인해보세요</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4" />
                      <span>회원 등급별 추가 혜택이 적용됩니다</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl xs:text-xl font-light mb-8">함께 구매하면 좋은 상품</h2>
          <p className="opacity-70 mb-8">장바구니 상품과 어울리는 추천 상품들을 확인해보세요</p>
          <Link 
            href="/products" 
            className="inline-block px-8 py-3 bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            추천 상품 보기
          </Link>
        </div>
      </section>
    </PageLayout>
  );
} 