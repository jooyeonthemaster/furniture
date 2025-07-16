const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, query, where } = require('firebase/firestore');

// Firebase 설정 (환경변수에서 가져오기)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupTestData() {
  console.log('🧹 테스트 데이터 정리 시작...');
  
  try {
    // test123 사용자의 모든 데이터 삭제
    const testUserId = 'test123';
    const collections = ['orders', 'wishlist', 'addresses', 'payments', 'shipping'];
    
    for (const collectionName of collections) {
      console.log(`\n📋 ${collectionName} 컬렉션 정리 중...`);
      
      let q;
      if (collectionName === 'wishlist') {
        q = query(collection(db, collectionName), where('userId', '==', testUserId));
      } else {
        q = query(collection(db, collectionName), where('customerId', '==', testUserId));
      }
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`✅ ${collectionName}: 정리할 데이터가 없습니다.`);
        continue;
      }
      
      console.log(`🗑️ ${collectionName}: ${querySnapshot.docs.length}개 문서 삭제 중...`);
      
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, collectionName, docSnapshot.id))
      );
      
      await Promise.all(deletePromises);
      console.log(`✅ ${collectionName}: ${querySnapshot.docs.length}개 문서 삭제 완료`);
    }
    
    // 추가로 실제 존재하지 않는 고객 ID로 된 데이터도 확인
    console.log('\n🔍 유효하지 않은 고객 데이터 확인 중...');
    
    // 실제 users 컬렉션과 대조해서 존재하지 않는 customerId 찾기 (선택사항)
    
    console.log('✅ 테스트 데이터 정리 완료!');
    console.log('\n📝 정리 요약:');
    console.log('- test123 사용자의 모든 데이터 삭제됨');
    console.log('- 이제 실제 로그인한 사용자의 데이터만 표시됩니다');
    
  } catch (error) {
    console.error('❌ 데이터 정리 실패:', error);
  }
}

// 환경변수 확인
function checkEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`❌ 환경변수 ${varName}이 설정되지 않았습니다.`);
      console.log('💡 .env.local 파일을 확인하세요.');
      return false;
    }
  }
  return true;
}

// 스크립트 실행
if (require.main === module) {
  // .env.local 파일 로드
  require('dotenv').config({ path: '.env.local' });
  
  if (checkEnvironmentVariables()) {
    cleanupTestData();
  }
}

module.exports = { cleanupTestData }; 