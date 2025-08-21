const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function hasBlob(u) {
  return typeof u === 'string' && u.startsWith('blob:');
}

async function scan() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snap = await getDocs(collection(db, 'products'));
  let total = 0;
  let withBlob = 0;

  for (const d of snap.docs) {
    total += 1;
    const data = d.data();
    const images = Array.isArray(data.images) ? data.images : [];
    if (images.some(hasBlob)) {
      withBlob += 1;
      console.log(`
🔎 ${d.id} 에 blob URL 존재`);
      console.log(images);
    }
  }

  console.log(`\n요약: 총 ${total}건, blob 포함 ${withBlob}건`);
}

if (require.main === module) {
  scan().catch((e) => {
    console.error('실패:', e);
    process.exit(1);
  });
}

module.exports = { scan };


