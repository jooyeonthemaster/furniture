'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleAuthSuccess = () => {
    // 인증 성공 시 홈으로 리다이렉트
    router.push('/');
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16 xs:py-12">
        <div className="w-full max-w-md mx-auto">
          {/* 인증 폼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-background border border-border rounded-lg p-8 xs:p-6 shadow-lg">
              {/* 로고 */}
              <div className="text-center mb-8">
                <h1 className="text-3xl xs:text-2xl font-light tracking-widest mb-2">
                  LUXE
                </h1>
                <p className="text-sm text-muted-foreground">
                  프리미엄 중고 디자이너 가구
                </p>
              </div>

              {/* 모드 토글 */}
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1 mb-8">
                <button
                  onClick={() => setMode('signup')}
                  className={`
                    flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
                    ${mode === 'signup' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  회원가입
                </button>
                <button
                  onClick={() => setMode('login')}
                  className={`
                    flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
                    ${mode === 'login' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  로그인
                </button>
              </div>

              {/* 폼 렌더링 */}
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mode === 'signup' ? (
                  <SignupForm
                    defaultRole={selectedRole}
                    onSuccess={handleAuthSuccess}
                    onSwitchToLogin={() => setMode('login')}
                  />
                ) : (
                  <LoginForm
                    role={selectedRole}
                    onSuccess={handleAuthSuccess}
                    onSwitchToSignup={() => setMode('signup')}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
} 