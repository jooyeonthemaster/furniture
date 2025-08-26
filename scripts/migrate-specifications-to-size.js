/**
 * 기존 상품의 specifications.dimensions와 specifications.weight를 
 * specifications.size로 통합하고 maxWeight 필드를 제거하는 마이그레이션 스크립트
 */

const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin 초기화
if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
  
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://your-project-id.firebaseio.com" // 실제 프로젝트 URL로 변경 필요
    });
  } catch (error) {
    console.error('Firebase 초기화 실패:', error.message);
    console.log('firebase-service-account.json 파일이 scripts 폴더에 있는지 확인하세요.');
    process.exit(1);
  }
}

const db = admin.firestore();

async function migrateSpecifications() {
  console.log('🚀 상품 사양 마이그레이션 시작...');
  
  try {
    // 모든 상품 가져오기
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      console.log('📦 마이그레이션할 상품이 없습니다.');
      return;
    }

    console.log(`📊 총 ${productsSnapshot.size}개의 상품을 처리합니다.`);
    
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    // 배치 처리를 위한 배치 객체
    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500; // Firestore 배치 제한
    
    for (const doc of productsSnapshot.docs) {
      try {
        const productData = doc.data();
        const productId = doc.id;
        
        processedCount++;
        
        // specifications가 없으면 건너뛰기
        if (!productData.specifications) {
          console.log(`⏭️  [${productId}] specifications 없음 - 건너뛰기`);
          continue;
        }
        
        const specs = productData.specifications;
        let needsUpdate = false;
        const newSpecs = { ...specs };
        
        // size 필드가 이미 있고 값이 있으면 건너뛰기
        if (specs.size && specs.size.trim()) {
          console.log(`✅ [${productId}] 이미 size 필드 존재 - 건너뛰기`);
          continue;
        }
        
        // dimensions와 weight를 size로 통합
        const sizeParts = [];
        
        if (specs.dimensions && specs.dimensions.trim()) {
          sizeParts.push(specs.dimensions.trim());
          delete newSpecs.dimensions;
          needsUpdate = true;
        }
        
        if (specs.weight && specs.weight.trim()) {
          sizeParts.push(specs.weight.trim());
          delete newSpecs.weight;
          needsUpdate = true;
        }
        
        // maxWeight 필드 제거
        if (specs.maxWeight !== undefined) {
          delete newSpecs.maxWeight;
          needsUpdate = true;
        }
        
        // size 필드 설정
        if (sizeParts.length > 0) {
          newSpecs.size = sizeParts.join(', ');
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          // 배치에 업데이트 추가
          batch.update(doc.ref, { specifications: newSpecs });
          batchCount++;
          updatedCount++;
          
          console.log(`🔄 [${productId}] 업데이트 예정: ${sizeParts.join(', ') || '필드 정리만'}`);
          
          // 배치 크기 제한 확인
          if (batchCount >= BATCH_SIZE) {
            console.log(`📦 배치 커밋 중... (${batchCount}개 항목)`);
            await batch.commit();
            batchCount = 0;
          }
        }
        
      } catch (error) {
        errorCount++;
        console.error(`❌ [${doc.id}] 처리 중 오류:`, error.message);
      }
    }
    
    // 남은 배치 커밋
    if (batchCount > 0) {
      console.log(`📦 마지막 배치 커밋 중... (${batchCount}개 항목)`);
      await batch.commit();
    }
    
    console.log('\n🎉 마이그레이션 완료!');
    console.log(`📊 처리된 상품: ${processedCount}개`);
    console.log(`✅ 업데이트된 상품: ${updatedCount}개`);
    console.log(`❌ 오류 발생: ${errorCount}개`);
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  }
}

// 스크립트 실행
if (require.main === module) {
  migrateSpecifications()
    .then(() => {
      console.log('✨ 마이그레이션이 성공적으로 완료되었습니다!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 마이그레이션 실패:', error);
      process.exit(1);
    });
}

module.exports = { migrateSpecifications };
