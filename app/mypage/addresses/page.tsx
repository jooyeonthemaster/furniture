'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/ClientProviders';
import { useRouter } from 'next/navigation';
import { Address } from '@/types';
import { Plus, MapPin, Phone, Home, Building, MoreHorizontal, Check } from 'lucide-react';

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    label: '집',
    isDefault: false
  });

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 인증이 완료되었는데 사용자가 없으면 로그인 페이지로 이동
    if (!user) {
      router.push('/register?redirect=/mypage/addresses');
      return;
    }

    fetchAddresses();
  }, [user, router, authLoading]);

  // 주소 목록 조회
  const fetchAddresses = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/addresses?customerId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.addresses);
      } else {
        console.error('주소 목록 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('주소 목록 조회 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  // 새 주소 추가
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.id,
          ...formData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAddresses(); // 목록 새로고침
        setShowAddForm(false);
        setFormData({
          recipientName: '',
          recipientPhone: '',
          zipCode: '',
          address: '',
          detailAddress: '',
          label: '집',
          isDefault: false
        });
        alert('주소가 성공적으로 추가되었습니다.');
      } else {
        alert('주소 추가에 실패했습니다: ' + data.error);
      }
    } catch (error) {
      console.error('주소 추가 에러:', error);
      alert('주소 추가 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">로그인이 필요합니다.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">주소 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">배송지 관리</h1>
        <p className="text-muted-foreground">배송지를 추가하고 관리하세요.</p>
      </div>

      {/* 주소 추가 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 배송지 추가
        </button>
      </div>

      {/* 주소 추가 폼 */}
      {showAddForm && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">새 배송지 추가</h3>
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">받는 사람</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">연락처</label>
                <input
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">우편번호</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">주소</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">상세 주소</label>
              <input
                type="text"
                value={formData.detailAddress}
                onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="동, 호수 등"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">배송지 구분</label>
                <select
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="집">집</option>
                  <option value="회사">회사</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">기본 배송지로 설정</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                추가하기
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 주소 목록 */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">등록된 배송지가 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              새 배송지를 추가하여 빠른 주문을 이용하세요.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              첫 배송지 추가하기
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white border rounded-lg p-6 relative ${
                address.isDefault ? 'border-primary bg-primary/5' : ''
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    <Check className="w-3 h-3" />
                    기본 배송지
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  {address.label === '집' ? (
                    <Home className="w-5 h-5 text-muted-foreground" />
                  ) : address.label === '회사' ? (
                    <Building className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{address.label}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{address.recipientName}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {address.recipientPhone}
                    </p>
                    <p>
                      ({address.zipCode}) {address.address}
                      {address.detailAddress && `, ${address.detailAddress}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 