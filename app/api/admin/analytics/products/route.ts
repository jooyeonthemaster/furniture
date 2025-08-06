import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 상품 통계 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // 기본 데이터
    const defaultData = {
      totalProducts: 0,
      newProducts: 0,
      activeProducts: 0,
      totalViews: 0,
      totalLikes: 0,
      categoryDistribution: [],
      topBrands: [],
      priceDistribution: [],
      topViewedProducts: [],
      monthlyTrends: [],
      stockAnalysis: {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalStock: 0
      },
      averagePrice: 0,
      featuredProducts: 0,
      discountedProducts: 0,
      averageDiscount: 0
    };

    try {
      // 상품 데이터 조회
      const productsSnapshot = await getDocs(collection(db, 'products'));
      console.log('📦 상품 컬렉션 문서 수:', productsSnapshot.docs.length);

      if (productsSnapshot.docs.length > 0) {
        const products = productsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unknown Product',
            category: data.category || 'unknown',
            brand: data.brand || 'Unknown',
            stock: data.stock || 0,
            views: data.views || 0,
            likes: data.likes || 0,
            salePrice: data.salePrice || 0,
            originalPrice: data.originalPrice || 0,
            featured: data.featured || false,
            discount: data.discount || 0
          };
        });

        defaultData.totalProducts = products.length;
        defaultData.activeProducts = products.filter(p => p.stock > 0).length;
        defaultData.totalViews = products.reduce((sum, p) => sum + p.views, 0);
        defaultData.totalLikes = products.reduce((sum, p) => sum + p.likes, 0);
        defaultData.featuredProducts = products.filter(p => p.featured).length;
        defaultData.discountedProducts = products.filter(p => p.discount > 0).length;

        // 카테고리별 분포
        const categoryCounts: { [key: string]: number } = {};
        products.forEach(product => {
          const category = getCategoryDisplayName(product.category);
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        defaultData.categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
          category,
          count,
          percentage: products.length > 0 ? (count / products.length) * 100 : 0
        }));

        // 브랜드별 분포
        const brandCounts: { [key: string]: number } = {};
        products.forEach(product => {
          brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
        });

        defaultData.topBrands = Object.entries(brandCounts)
          .map(([brand, count]) => ({ brand, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        // 재고 분석
        defaultData.stockAnalysis = {
          inStock: products.filter(p => p.stock > 10).length,
          lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
          outOfStock: products.filter(p => p.stock === 0).length,
          totalStock: products.reduce((sum, p) => sum + p.stock, 0)
        };

        // 평균 가격
        const productsWithPrice = products.filter(p => p.salePrice > 0 || p.originalPrice > 0);
        if (productsWithPrice.length > 0) {
          defaultData.averagePrice = Math.round(
            productsWithPrice.reduce((sum, p) => sum + (p.salePrice || p.originalPrice), 0) / productsWithPrice.length
          );
        }
      }

    } catch (firebaseError) {
      console.error('Firebase 연결 에러:', firebaseError);
    }

    return NextResponse.json(defaultData);

  } catch (error) {
    console.error('❌ 상품 통계 조회 실패:', error);
    return NextResponse.json({
      totalProducts: 0,
      newProducts: 0,
      activeProducts: 0,
      totalViews: 0,
      totalLikes: 0,
      categoryDistribution: [],
      topBrands: [],
      priceDistribution: [],
      topViewedProducts: [],
      monthlyTrends: [],
      stockAnalysis: {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalStock: 0
      },
      averagePrice: 0,
      featuredProducts: 0,
      discountedProducts: 0,
      averageDiscount: 0
    });
  }
}

function getCategoryDisplayName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'new': '신상품',
    'furniture': '가구',
    'lighting': '조명',
    'kitchen': '주방',
    'accessories': '액세서리',
    'textile': '텍스타일',
    'kids': '키즈',
    'book': '도서',
    'sale': '세일'
  };
  return categoryMap[category] || category;
}