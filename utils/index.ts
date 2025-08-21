// 대표 이미지 선택 유틸리티
// - blob: URL 제외
// - Cloudinary 최적화 파라미터가 포함된 overviewImages 우선 대체 옵션 제공
// - 없으면 플레이스홀더 반환

export function getPrimaryImageUrl(
  product: { images?: string[]; overviewImages?: string[] }
): string {
  const isValid = (url?: string) => {
    if (!url) return false;
    if (url.startsWith('blob:')) return false;
    // Cloudinary 플레이스홀더 자원(삭제/이동 가능성 높음)은 무효 처리
    if (url.includes('placeholder-furniture.jpg')) return false;
    return true;
  };

  // 1) 상품 이미지 배열에서 첫 유효 URL
  const candidateFromImages = product.images?.find(isValid);
  if (candidateFromImages) return candidateFromImages;

  // 2) 개요 이미지가 있다면 그중 첫 유효 URL 사용
  const candidateFromOverview = product.overviewImages?.find(isValid);
  if (candidateFromOverview) return candidateFromOverview;

  // 3) 플레이스홀더
  return '/placeholder-image.jpg';
}


