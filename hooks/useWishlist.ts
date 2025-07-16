'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { WishlistItem, Product } from '@/types';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 찜 목록 조회
  const fetchWishlist = async () => {
    if (!user) {
      console.log('👤 사용자 정보 없음 - 찜 목록 조회 건너뛰기');
      return;
    }

    try {
      console.log('🚀 찜 목록 조회 시작:', { userId: user.id });
      setLoading(true);
      setError(null);

      const url = `/api/wishlist?userId=${user.id}`;
      console.log('📡 API 호출:', url);

      const response = await fetch(url);
      
      console.log('📨 응답 상태:', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
        console.error('🚫 API 응답 오류:', errorData);
        throw new Error(errorData.error || errorData.details || '찜 목록 조회에 실패했습니다.');
      }

      const data = await response.json();
      console.log('📦 받은 데이터:', data);
      
      setWishlistItems(data.items || []);
      console.log('✅ 찜 목록 조회 완료:', data.items?.length || 0, '개 항목');
      
    } catch (error) {
      console.error('❌ 찜 목록 조회 실패:', error);
      console.error('에러 상세:', {
        message: (error as Error).message,
        type: typeof error,
        error
      });
      setError(error instanceof Error ? error.message : '찜 목록 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 찜 목록에 추가
  const addToWishlist = async (productId: string) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '찜 목록 추가에 실패했습니다.');
      }

      const data = await response.json();
      setWishlistItems(prev => [data.item, ...prev]);
      
      return true;
    } catch (error) {
      console.error('찜 목록 추가 실패:', error);
      throw error;
    }
  };

  // 찜 목록에서 제거
  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const response = await fetch(`/api/wishlist?userId=${user.id}&productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '찜 목록 제거에 실패했습니다.');
      }

      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      
      return true;
    } catch (error) {
      console.error('찜 목록 제거 실패:', error);
      throw error;
    }
  };

  // 찜 목록 토글 (추가/제거)
  const toggleWishlist = async (productId: string) => {
    const isInWishlist = wishlistItems.some(item => item.productId === productId);
    
    if (isInWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  // 상품이 찜 목록에 있는지 확인
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.productId === productId);
  };

  // 찜 목록 개수
  const wishlistCount = wishlistItems.length;

  // 사용자 로그인 시 찜 목록 자동 로드
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  return {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount,
    fetchWishlist,
  };
} 