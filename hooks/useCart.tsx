'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  maxStock: number;
  // 옵션 정보 추가
  selectedOptions?: {
    [optionId: string]: {
      optionName: string;
      valueId: string;
      valueName: string;
      colorCode?: string;
      priceModifier?: number;
    };
  };
  // 옵션 적용된 최종 가격
  finalPrice?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addItem: (product: Omit<CartItem, 'id' | 'quantity'>) => void;
  addItemWithOptions: (product: Omit<CartItem, 'id' | 'quantity'>, options?: CartItem['selectedOptions']) => void;
  removeItem: (productId: string, optionKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, optionKey?: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, optionKey?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalAmount: 0,
    isLoading: false,
  });

  // 로컬 스토리지에서 장바구니 불러오기
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setState(prev => ({
          ...prev,
          items: parsedCart.items || [],
        }));
      } catch (error) {
        console.error('장바구니 데이터 로드 실패:', error);
      }
    }
  }, []);

  // 총 개수와 총 금액 계산
  useEffect(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = state.items.reduce((sum, item) => sum + ((item.finalPrice || item.salePrice) * item.quantity), 0);
    
    setState(prev => ({
      ...prev,
      totalItems,
      totalAmount,
    }));
  }, [state.items]);

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: state.items }));
  }, [state.items]);

  // 옵션 키 생성 함수
  const getOptionKey = (productId: string, options?: CartItem['selectedOptions']) => {
    if (!options || Object.keys(options).length === 0) {
      return productId;
    }
    
    const optionString = Object.values(options)
      .map(opt => `${opt.optionName}:${opt.valueName}`)
      .sort()
      .join('|');
    
    return `${productId}_${btoa(optionString)}`;
  };

  const addItem = (product: Omit<CartItem, 'id' | 'quantity'>) => {
    addItemWithOptions(product, undefined);
  };

  const addItemWithOptions = (product: Omit<CartItem, 'id' | 'quantity'>, options?: CartItem['selectedOptions']) => {
    setState(prev => {
      const optionKey = getOptionKey(product.productId, options);
      const existingItem = prev.items.find(item => item.id === optionKey);
      
      // 옵션 가격 modifier 계산
      const priceModifier = options ? Object.values(options).reduce((sum, opt) => sum + (opt.priceModifier || 0), 0) : 0;
      const finalPrice = product.salePrice + priceModifier;
      
      if (existingItem) {
        // 이미 있는 상품+옵션 조합이면 수량 증가
        const newQuantity = Math.min(existingItem.quantity + 1, product.maxStock);
        return {
          ...prev,
          items: prev.items.map(item =>
            item.id === optionKey
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      } else {
        // 새 상품+옵션 조합 추가
        const newItem: CartItem = {
          ...product,
          id: optionKey,
          quantity: 1,
          selectedOptions: options,
          finalPrice,
        };
        return {
          ...prev,
          items: [...prev.items, newItem],
        };
      }
    });
  };

  const removeItem = (productId: string, optionKey?: string) => {
    const itemId = optionKey || productId;
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const updateQuantity = (productId: string, quantity: number, optionKey?: string) => {
    const itemId = optionKey || productId;
    
    if (quantity <= 0) {
      removeItem(productId, optionKey);
      return;
    }

    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      ),
    }));
  };

  const clearCart = () => {
    setState(prev => ({
      ...prev,
      items: [],
    }));
  };

  const getItemQuantity = (productId: string, optionKey?: string): number => {
    const itemId = optionKey || productId;
    const item = state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        addItemWithOptions,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 