import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/types';

const PRODUCTS_COLLECTION = 'products';

// 상품 추가
export async function addProduct(productData: Omit<Product, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // 기본값 설정  
      views: productData.views || 0,
      likes: productData.likes || 0
    });
    
    return docRef.id;
  } catch (error) {
    console.error('상품 추가 실패:', error);
    throw new Error('상품 추가에 실패했습니다.');
  }
}

// 상품 수정
export async function updateProduct(productId: string, productData: Partial<Product>) {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('상품 수정 실패:', error);
    throw new Error('상품 수정에 실패했습니다.');
  }
}

// 상품 삭제
export async function deleteProduct(productId: string) {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
    
    return true;
  } catch (error) {
    console.error('상품 삭제 실패:', error);
    throw new Error('상품 삭제에 실패했습니다.');
  }
}

// 여러 상품 일괄 삭제
export async function deleteMultipleProducts(productIds: string[]) {
  try {
    const deletePromises = productIds.map(id => deleteProduct(id));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('일괄 삭제 실패:', error);
    throw new Error('상품 일괄 삭제에 실패했습니다.');
  }
}

// 단일 상품 조회
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return null;
    }
    
    const data = productSnap.data();
    return {
      id: productSnap.id,
      ...data,
      // Timestamp를 문자열로 변환
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    } as Product;
  } catch (error) {
    console.error('상품 조회 실패:', error);
    throw new Error('상품 조회에 실패했습니다.');
  }
}

// getProductById alias (상품 상세 페이지용)
export const getProductById = getProduct;

// 모든 상품 조회 (관리자용)
export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    }) as Product[];
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    throw new Error('상품 목록 조회에 실패했습니다.');
  }
}

// 필터링된 상품 조회
export async function getFilteredProducts(filters: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;

  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  try {
    let q = query(collection(db, PRODUCTS_COLLECTION));
    
    // 필터 조건 추가
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.brand) {
      q = query(q, where('brand', '==', filters.brand));
    }
    
    if (filters.condition) {
      q = query(q, where('condition', '==', filters.condition));
    }
    

    
    if (filters.featured !== undefined) {
      q = query(q, where('featured', '==', filters.featured));
    }
    
    // 가격 필터는 클라이언트 사이드에서 처리 (Firestore 복합 쿼리 제한)
    
    // 정렬 및 제한
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    
    let products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    }) as Product[];
    
    // 가격 필터링 (클라이언트 사이드)
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.salePrice >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.salePrice <= filters.maxPrice!);
    }
    
    return products;
  } catch (error) {
    console.error('필터링된 상품 조회 실패:', error);
    throw new Error('상품 조회에 실패했습니다.');
  }
}

// 추천 상품 조회
export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
  return getFilteredProducts({
    featured: true,
    limit: limitCount
  });
}

// 인기 상품 조회 (판매량 기준)
export async function getPopularProducts(limitCount: number = 8): Promise<Product[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    }) as Product[];
  } catch (error) {
    console.error('인기 상품 조회 실패:', error);
    throw new Error('인기 상품 조회에 실패했습니다.');
  }
}

// 상품 조회수 증가
export async function incrementViewCount(productId: string) {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const currentViews = productSnap.data().views || 0;
      await updateDoc(productRef, {
        views: currentViews + 1,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('조회수 증가 실패:', error);
    // 조회수 증가 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}

// 상품 재고 업데이트
export async function updateProductStock(productId: string, newStock: number) {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    

    
    await updateDoc(productRef, {
      stock: newStock,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('재고 업데이트 실패:', error);
    throw new Error('재고 업데이트에 실패했습니다.');
  }
}

// 상품 상태 변경 (활성/비활성)
export async function updateProductStatus(productId: string, status: 'active' | 'inactive' | 'pending' | 'sold') {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    
    await updateDoc(productRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('상품 상태 변경 실패:', error);
    throw new Error('상품 상태 변경에 실패했습니다.');
  }
}

// 브랜드별 상품 개수 조회
export async function getProductCountByBrand(): Promise<Record<string, number>> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    const brandCounts: Record<string, number> = {};
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const brand = data.brand;
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    
    return brandCounts;
  } catch (error) {
    console.error('브랜드별 상품 개수 조회 실패:', error);
    throw new Error('브랜드별 상품 개수 조회에 실패했습니다.');
  }
}

// 카테고리별 상품 개수 조회
export async function getProductCountByCategory(): Promise<Record<string, number>> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    const categoryCounts: Record<string, number> = {};
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const category = data.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return categoryCounts;
  } catch (error) {
    console.error('카테고리별 상품 개수 조회 실패:', error);
    throw new Error('카테고리별 상품 개수 조회에 실패했습니다.');
  }
}

// 연계 상품 관련 함수들
export async function getProductsByCategory(category: string, excludeId?: string): Promise<Product[]> {
  try {
    // 인덱스 에러 방지를 위해 orderBy 제거하고 클라이언트 사이드에서 정렬
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    let products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
    
    // 클라이언트 사이드에서 createdAt으로 정렬
    products = products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 현재 편집 중인 상품 제외
    return excludeId ? products.filter(product => product.id !== excludeId) : products;
  } catch (error) {
    console.error('카테고리별 상품 조회 실패:', error);
    throw new Error('카테고리별 상품 조회에 실패했습니다.');
  }
}

export async function getRelatedProducts(productIds: string[]): Promise<Product[]> {
  try {
    if (productIds.length === 0) return [];
    
    const products: Product[] = [];
    
    // Firestore의 in 쿼리는 최대 10개까지만 가능하므로 배치로 처리
    for (let i = 0; i < productIds.length; i += 10) {
      const batch = productIds.slice(i, i + 10);
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('__name__', 'in', batch)
      );
      
      const querySnapshot = await getDocs(q);
      const batchProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Product[];
      
      products.push(...batchProducts);
    }
    
    return products;
  } catch (error) {
    console.error('연계 상품 조회 실패:', error);
    throw new Error('연계 상품 조회에 실패했습니다.');
  }
}

export async function searchProducts(searchTerm: string, category?: string): Promise<Product[]> {
  try {
    let q = query(collection(db, PRODUCTS_COLLECTION));
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
    
    // 클라이언트 사이드에서 텍스트 검색 (Firebase에서는 full-text search가 제한적)
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // 클라이언트 사이드에서 createdAt으로 정렬
    filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return filteredProducts;
  } catch (error) {
    console.error('상품 검색 실패:', error);
    throw new Error('상품 검색에 실패했습니다.');
  }
}