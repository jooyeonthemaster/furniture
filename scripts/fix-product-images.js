// products.images 배열에서 blob: URL을 제거/치환하는 일회성 정리 스크립트
// - 첫 번째 유효한 URL을 대표로 유지
// - 모두 blob:이면 overviewImages의 첫 유효 URL을 대표로 대체
// - 그래도 없으면 플레이스홀더로 채움

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function isValid(url) {
  return typeof url === 'string' && url.length > 0 && !url.startsWith('blob:');
}

async function fixProductImages() {
  console.log('🔧 products.images 정리 시작');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, 'products'));
  let updated = 0;
  let scanned = 0;

  for (const d of snap.docs) {
    scanned += 1;
    const data = d.data();
    const images = Array.isArray(data.images) ? data.images : [];
    const overviewImages = Array.isArray(data.overviewImages) ? data.overviewImages : [];

    const hadBlob = images.some((u) => typeof u === 'string' && u.startsWith('blob:'));
    if (!hadBlob) continue;

    // 1) images에서 유효 URL만 남김
    const cleaned = images.filter(isValid);

    // 2) 대표 대체: 없으면 overview에서 보충
    if (cleaned.length === 0) {
      const fromOverview = overviewImages.find(isValid);
      if (fromOverview) cleaned.push(fromOverview);
    }

    // 3) 그래도 없으면 플레이스홀더
    if (cleaned.length === 0) {
      cleaned.push('/placeholder-image.jpg');
    }

    await updateDoc(doc(db, 'products', d.id), { images: cleaned, updatedAt: new Date() });
    updated += 1;
    console.log(`✅ ${d.id} 업데이트: ${images.length} → ${cleaned.length}`);
  }

  console.log(`
요약: 스캔 ${scanned}건, 업데이트 ${updated}건 완료`);
}

if (require.main === module) {
  fixProductImages().catch((e) => {
    console.error('❌ 실패:', e);
    process.exit(1);
  });
}

module.exports = { fixProductImages };


