'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/components/providers/ClientProviders';

export default function TestFirebasePage() {
  const { user, loading } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('test123456');
  const [status, setStatus] = useState<string>('Firebase 연결 상태 확인 중...');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    try {
      setStatus('Firebase 연결 테스트 시작...');
      addResult('🔥 Firebase 연결 테스트 시작');

      // 1. Firebase 설정 확인
      if (!auth || !db) {
        throw new Error('Firebase 초기화 실패');
      }
      addResult('✅ Firebase 초기화 성공');

      // 2. Firestore 연결 테스트 (읽기)
      try {
        const testDocRef = doc(db, 'test', 'connection');
        await getDoc(testDocRef);
        addResult('✅ Firestore 연결 성공');
      } catch (error) {
        addResult('❌ Firestore 연결 실패: ' + (error as Error).message);
      }

      // 3. Firestore 쓰기 테스트
      try {
        const testDocRef = doc(db, 'test', 'connection');
        await setDoc(testDocRef, {
          timestamp: new Date(),
          message: 'Firebase 연결 테스트',
          status: 'success'
        });
        addResult('✅ Firestore 쓰기 성공');
      } catch (error) {
        addResult('❌ Firestore 쓰기 실패: ' + (error as Error).message);
      }

      setStatus('✅ Firebase 연결 테스트 완료!');
    } catch (error) {
      setStatus('❌ Firebase 연결 실패');
      addResult('❌ 테스트 실패: ' + (error as Error).message);
    }
  };

  const testAuth = async () => {
    try {
      addResult('🔐 인증 테스트 시작');
      
      // 테스트용 계정 생성 시도
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        addResult('✅ 회원가입 성공: ' + userCredential.user.email);
        
        // 바로 로그아웃
        await signOut(auth);
        addResult('✅ 로그아웃 성공');
        
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          addResult('ℹ️ 계정이 이미 존재함 - 로그인 테스트 진행');
          
          // 로그인 테스트
          try {
            const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
            addResult('✅ 로그인 성공: ' + userCredential.user.email);
            
            // 로그아웃
            await signOut(auth);
            addResult('✅ 로그아웃 성공');
          } catch (loginError) {
            addResult('❌ 로그인 실패: ' + (loginError as Error).message);
          }
        } else {
          addResult('❌ 회원가입 실패: ' + error.message);
        }
      }
    } catch (error) {
      addResult('❌ 인증 테스트 실패: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔥 Firebase 연결 테스트</h1>
        
        {/* 현재 상태 */}
        <div className="mb-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">현재 상태</h2>
          <p className="text-lg">{status}</p>
          {loading && <p className="text-yellow-600">인증 상태 로딩 중...</p>}
          {user && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">✅ 현재 로그인된 사용자: {user.email}</p>
              <p className="text-green-800">UID: {user.id}</p>
            </div>
          )}
        </div>

        {/* 테스트 버튼들 */}
        <div className="mb-8 space-y-4">
          <button
            onClick={testFirebaseConnection}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔄 Firebase 연결 재테스트
          </button>
          
          <button
            onClick={testAuth}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ml-4"
          >
            🔐 인증 테스트
          </button>
        </div>

        {/* 테스트 입력 */}
        <div className="mb-8 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-4">테스트 계정 설정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 테스트 결과 로그 */}
        <div className="p-6 bg-black text-green-400 rounded-lg font-mono text-sm">
          <h3 className="text-lg font-semibold mb-4 text-white">📋 테스트 로그</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400">테스트 결과가 여기에 표시됩니다...</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 환경변수 확인 */}
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-4">🔧 환경변수 확인</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ 설정됨' : '❌ 없음'}</p>
              <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ 설정됨' : '❌ 없음'}</p>
              <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ 설정됨' : '❌ 없음'}</p>
            </div>
            <div>
              <p><strong>Storage Bucket:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ 설정됨' : '❌ 없음'}</p>
              <p><strong>Messaging Sender ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ 설정됨' : '❌ 없음'}</p>
              <p><strong>App ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ 설정됨' : '❌ 없음'}</p>
            </div>
          </div>
        </div>

        {/* 돌아가기 */}
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
          >
            🏠 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
} 