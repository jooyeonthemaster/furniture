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
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addItem: (product: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
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
    const totalAmount = state.items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    
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

  const addItem = (product: Omit<CartItem, 'id' | 'quantity'>) => {
    setState(prev => {
      const existingItem = prev.items.find(item => item.productId === product.productId);
      
      if (existingItem) {
        // 이미 있는 상품이면 수량 증가
        const newQuantity = Math.min(existingItem.quantity + 1, product.maxStock);
        return {
          ...prev,
          items: prev.items.map(item =>
            item.productId === product.productId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      } else {
        // 새 상품 추가
        const newItem: CartItem = {
          ...product,
          id: Date.now().toString(),
          quantity: 1,
        };
        return {
          ...prev,
          items: [...prev.items, newItem],
        };
      }
    });
  };

  const removeItem = (productId: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId),
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId
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

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
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