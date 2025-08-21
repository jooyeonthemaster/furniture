// images 배열에 Cloudinary placeholder-furniture.jpg 가 포함된 문서를 교체

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

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snap = await getDocs(collection(db, 'products'));

  let updated = 0;
  for (const d of snap.docs) {
    const data = d.data();
    const images = Array.isArray(data.images) ? data.images : [];
    if (!images.some((u) => typeof u === 'string' && u.includes('placeholder-furniture.jpg'))) continue;

    const cleaned = images.filter((u) => typeof u === 'string' && !u.includes('placeholder-furniture.jpg'));
    if (cleaned.length === 0) cleaned.push('/placeholder-image.jpg');

    await updateDoc(doc(db, 'products', d.id), { images: cleaned, updatedAt: new Date() });
    updated += 1;
    console.log(`✅ ${d.id} 교체 완료`);
  }

  console.log(`완료: 업데이트 ${updated}건`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };


