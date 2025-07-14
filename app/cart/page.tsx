'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Minus, Plus, X, ArrowLeft, ShoppingBag, CreditCard, 
  Truck, Shield, Info, Heart
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function CartPage() {
  const { items, totalAmount, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const shipping = totalAmount >= 300000 ? 0 : 30000; // 30만원 이상 무료배송
  const finalTotal = totalAmount + shipping - promoDiscount;

  const handlePromoCode = () => {
    // 간단한 프로모션 코드 처리
    if (promoCode === 'WELCOME10') {
      setPromoDiscount(Math.floor(totalAmount * 0.1));
    } else if (promoCode === 'SAVE20') {
      setPromoDiscount(Math.floor(totalAmount * 0.2));
    } else {
      alert('유효하지 않은 프로모션 코드입니다.');
    }
  };

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h1 className="text-2xl font-serif font-light mb-2">장바구니가 비어있습니다</h1>
              <p className="text-gray-600 mb-8">마음에 드는 상품을 장바구니에 담아보세요.</p>
              <Link 
                href="/products"
                className="bg-black text-white px-8 py-3 font-serif hover:bg-gray-800 transition-colors"
              >
                상품 둘러보기
              </Link>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Link href="/products" className="mr-4 p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-serif font-light">장바구니</h1>
              </div>
              <div className="text-sm text-gray-600">
                {totalItems}개 상품
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 상품 목록 */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-serif font-medium">상품 목록</h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                      전체 삭제
                    </button>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-4 pb-6 border-b border-gray-100 last:border-b-0"
                      >
                        {/* 상품 이미지 */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* 상품 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
                          <h3 className="font-medium text-gray-900 mb-2 truncate">{item.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg">{item.salePrice.toLocaleString()}원</span>
                            {item.originalPrice > item.salePrice && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  {item.originalPrice.toLocaleString()}원
                                </span>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                  {Math.round((1 - item.salePrice / item.originalPrice) * 100)}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* 수량 조절 */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium border-x border-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              disabled={item.quantity >= item.maxStock}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* 삭제 버튼 */}
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6 sticky top-8"
              >
                <h2 className="text-lg font-serif font-medium mb-6">주문 요약</h2>

                {/* 가격 계산 */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>상품 금액</span>
                    <span>{totalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>배송비</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}
                    </span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>할인</span>
                      <span>-{promoDiscount.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>총 결제 금액</span>
                      <span className="text-lg">{finalTotal.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                {/* 프로모션 코드 */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="프로모션 코드"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                    />
                    <button
                      onClick={handlePromoCode}
                      className="px-4 py-2 bg-gray-100 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      적용
                    </button>
                  </div>
                </div>

                {/* 주문하기 버튼 */}
                <div className="space-y-3">
                  {user ? (
                    <button className="w-full bg-black text-white py-3 font-serif font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>주문하기</span>
                    </button>
                  ) : (
                    <Link
                      href="/register"
                      className="w-full bg-black text-white py-3 font-serif font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      로그인 후 주문하기
                    </Link>
                  )}

                  <button className="w-full border border-gray-200 py-3 font-serif font-medium hover:bg-gray-50 transition-colors">
                    계속 쇼핑하기
                  </button>
                </div>

                {/* 혜택 안내 */}
                <div className="mt-6 space-y-3 text-xs text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Truck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>30만원 이상 구매 시 무료배송</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>정품 보증 및 7일 무조건 반품</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>상품 상담 및 A/S 지원</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 