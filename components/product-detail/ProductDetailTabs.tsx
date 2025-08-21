'use client';

import Image from 'next/image';
import { 
  Info, Ruler, CheckCircle, AlertTriangle, Star, FileText, 
  MapPin, Truck, Clock, Users, Package, Settings, Wrench
} from 'lucide-react';
import { Product } from '@/types';

interface ProductDetailTabsProps {
  product: Product;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export default function ProductDetailTabs({ product, selectedTab, setSelectedTab }: ProductDetailTabsProps) {
  const tabs = [
    { id: 'overview', label: '개요', icon: Info },
    { id: 'specs', label: '사양', icon: Ruler },
    { id: 'condition', label: '상태 정보', icon: CheckCircle },
    { id: 'guide', label: '사용 가이드', icon: FileText },
    { id: 'source', label: '소스 정보', icon: MapPin },
    { id: 'shipping', label: '배송', icon: Truck }
  ];

  return (
    <div className="space-y-6">
      {/* 가로 스크롤 탭 메뉴 (모든 화면 크기) */}
      <div className="border-b">
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          <div className="flex space-x-1 min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 lg:px-6 py-3 border-b-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  selectedTab === tab.id
                    ? 'border-foreground text-foreground bg-muted/30'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* 스크롤 힌트 표시 */}
        <div className="flex justify-center mt-2 sm:hidden">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
            <div className="w-6 h-2 bg-muted-foreground/50 rounded-full"></div>
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
          </div>
        </div>
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
                            quality={95}
                            priority={index === 0}
                            className="w-full h-auto object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-3">
                <h4 className="font-medium text-lg mb-3">기본 정보</h4>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">브랜드</span>
                  <span className="text-muted-foreground">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">카테고리</span>
                  <span className="text-muted-foreground">{product.category}</span>
                </div>
                {product.subcategory && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">서브카테고리</span>
                    <span className="text-muted-foreground">{product.subcategory}</span>
                  </div>
                )}
                {product.model && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">모델</span>
                    <span className="text-muted-foreground">{product.model}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">SKU</span>
                    <span className="text-muted-foreground">{product.sku}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">상태</span>
                  <span className="text-muted-foreground">
                    {product.condition === 'new' ? '신품' :
                     product.condition === 'like-new' ? 'A급 (최상)' :
                     product.condition === 'excellent' ? 'B급 (상)' :
                     product.condition === 'good' ? 'C급 (중)' :
                     product.condition === 'fair' ? 'D급 (하)' : product.condition}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">재고</span>
                  <span className="text-muted-foreground">{product.stock}개</span>
                </div>
                {product.availability && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">판매 상태</span>
                    <span className="text-muted-foreground">
                      {product.availability === 'in_stock' ? '판매중' :
                       product.availability === 'out_of_stock' ? '품절' :
                       product.availability === 'discontinued' ? '단종' : product.availability}
                    </span>
                  </div>
                )}
              </div>

              {/* 제품 사양 */}
              <div className="space-y-3">
                <h4 className="font-medium text-lg mb-3">제품 사양</h4>
                
                {/* 치수 정보 - specifications.dimensions를 우선 표시 (자유 입력 형식) */}
                {product.specifications?.dimensions ? (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">치수</span>
                    <span className="text-muted-foreground">{product.specifications.dimensions}</span>
                  </div>
                ) : product.dimensions && (product.dimensions.width > 0 || product.dimensions.height > 0 || product.dimensions.depth > 0) && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">치수</span>
                    <span className="text-muted-foreground">
                      {product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth}{product.dimensions.unit}
                    </span>
                  </div>
                )}
                
                {/* 무게 정보 */}
                {product.specifications?.weight && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">무게</span>
                    <span className="text-muted-foreground">{product.specifications.weight}</span>
                  </div>
                )}
                
                {/* 최대 하중 */}
                {product.specifications?.maxWeight && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">최대 하중</span>
                    <span className="text-muted-foreground">{product.specifications.maxWeight}</span>
                  </div>
                )}
                
                {/* 소재 정보 */}
                {product.materials && product.materials.length > 0 ? (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">소재</span>
                    <span className="text-muted-foreground">{product.materials.join(', ')}</span>
                  </div>
                ) : product.specifications?.material && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">소재</span>
                    <span className="text-muted-foreground">{product.specifications.material}</span>
                  </div>
                )}
                
                {/* 색상 정보 */}
                {product.colors && product.colors.length > 0 ? (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">색상</span>
                    <span className="text-muted-foreground">{product.colors.join(', ')}</span>
                  </div>
                ) : product.specifications?.color && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">색상</span>
                    <span className="text-muted-foreground">{product.specifications.color}</span>
                  </div>
                )}
                
                {/* 원산지 정보 */}
                {product.specifications?.origin && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">원산지</span>
                    <span className="text-muted-foreground">{product.specifications.origin}</span>
                  </div>
                )}
                
                {/* 제조년도 */}
                {product.specifications?.year && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">제조년도</span>
                    <span className="text-muted-foreground">{product.specifications.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'shipping' && (
          <div>
            <h3 className="text-xl font-medium mb-4">배송 정보</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className={`w-5 h-5 ${product.shipping?.free ? 'text-green-600' : 'text-gray-600'}`} />
                <div>
                  <p className="font-medium">
                    {product.shipping?.free ? '무료배송' : '유료배송'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.shipping?.free 
                      ? '전국 어디든 무료로 배송해드립니다' 
                      : '배송비가 별도로 부과됩니다'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">{product.shipping?.period || '3-5일'} 배송</p>
                  <p className="text-sm text-muted-foreground">
                    주문 후 {product.shipping?.period || '3-5일'} 내에 배송됩니다
                  </p>
                </div>
              </div>
              
              {product.shipping?.installation && (
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">
                      설치 서비스 
                      {product.shipping.installationFee > 0 && 
                        ` (${product.shipping.installationFee.toLocaleString()}원)`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      전문 설치기사가 직접 설치해드립니다
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium">안전 포장</p>
                  <p className="text-sm text-muted-foreground">가구 전용 포장재로 안전하게 배송됩니다</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'condition' && (
          <div>
            <h3 className="text-xl font-medium mb-4">상태 정보</h3>
            {product.conditionReport ? (
              <div className="space-y-6">
                {/* 전체 상태 */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">전체 상태: {product.conditionReport.overall}</span>
                  </div>
                </div>

                {/* 장점 */}
                {product.conditionReport.strengths && product.conditionReport.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-3 text-green-600">✓ 장점</h4>
                    <ul className="space-y-2">
                      {product.conditionReport.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 단점/결함 */}
                {product.conditionReport.minorFlaws && product.conditionReport.minorFlaws.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-3 text-orange-600">⚠ 주의사항</h4>
                    <ul className="space-y-2">
                      {product.conditionReport.minorFlaws.map((flaw, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{flaw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 세부 상태 */}
                {product.conditionReport.details && product.conditionReport.details.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-3">세부 상태</h4>
                    <div className="space-y-3">
                      {product.conditionReport.details.map((detail, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{detail.item}</span>
                            <span className="text-sm text-muted-foreground">{detail.condition}</span>
                          </div>
                          {detail.note && (
                            <p className="text-sm text-muted-foreground">{detail.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">상태 정보가 등록되지 않았습니다.</p>
            )}
          </div>
        )}

        {selectedTab === 'guide' && (
          <div>
            <h3 className="text-xl font-medium mb-4">사용 가이드</h3>
            {product.usageGuide ? (
              <div className="space-y-6">
                {/* 설치 가이드 */}
                {product.usageGuide.setup && product.usageGuide.setup.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-3 flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <span>설치 가이드</span>
                    </h4>
                    <ol className="space-y-2">
                      {product.usageGuide.setup.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* 관리 가이드 */}
                {product.usageGuide.maintenance && product.usageGuide.maintenance.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-3 flex items-center space-x-2">
                      <Wrench className="w-5 h-5 text-green-600" />
                      <span>관리 가이드</span>
                    </h4>
                    <ul className="space-y-2">
                      {product.usageGuide.maintenance.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 사용 팁 */}
                {product.usageGuide.tips && product.usageGuide.tips.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-3 flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span>사용 팁</span>
                    </h4>
                    <ul className="space-y-2">
                      {product.usageGuide.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">사용 가이드가 등록되지 않았습니다.</p>
            )}
          </div>
        )}

        {selectedTab === 'source' && (
          <div>
            <h3 className="text-xl font-medium mb-4">소스 정보</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">소스 타입</span>
                  <span className="text-muted-foreground">
                    {product.source === 'model-house' ? '모델하우스' :
                     product.source === 'exhibition' ? '전시회' :
                     product.source === 'display' ? '매장 디스플레이' :
                     product.source === 'photoshoot' ? '촬영용' : 
                     product.source === 'other' ? '기타' : product.source}
                  </span>
                </div>
                
                {product.sourceDetails && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">소스명</span>
                    <span className="text-muted-foreground">{product.sourceDetails}</span>
                  </div>
                )}
                
                {product.sourceLocation && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">위치</span>
                    <span className="text-muted-foreground">{product.sourceLocation}</span>
                  </div>
                )}
                
                {product.sourceDate && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">날짜</span>
                    <span className="text-muted-foreground">{product.sourceDate}</span>
                  </div>
                )}
              </div>
              
              {product.sourceUsage && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">사용 내역</h4>
                  <p className="text-muted-foreground bg-muted rounded-lg p-4">{product.sourceUsage}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}