'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/providers/ClientProviders';
import GoogleLoginButton from './GoogleLoginButton';
import type { UserRole } from '@/types';

interface LoginFormProps {
  role?: UserRole;
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export default function LoginForm({ 
  role = 'customer', 
  onSuccess,
  onSwitchToSignup 
}: LoginFormProps) {
  const { signInWithEmail, error: authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await signInWithEmail(formData.email, formData.password);
      onSuccess?.();
    } catch (error) {
      // 에러는 useAuth에서 처리됨
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getRoleText = () => {
    switch (role) {
      case 'dealer': return '딜러';
      case 'admin': return '관리자';
      default: return '고객';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl xs:text-2xl font-light mb-2">로그인</h1>
        <p className="text-muted-foreground">{getRoleText()} 계정으로 로그인하세요</p>
      </motion.div>

      {/* 에러 메시지 */}
      {authError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 text-destructive" />
          <p className="text-sm text-destructive">{authError}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* 구글 로그인 */}
        <GoogleLoginButton
          role={role}
          onSuccess={onSuccess}
          text="Google로 로그인"
        />

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">또는</span>
          </div>
        </div>

        {/* 이메일/비밀번호 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`
                w-full bg-transparent border-b border-input 
                px-0 py-2 focus:outline-none focus:border-primary 
                transition-colors duration-200
                ${errors.email ? 'border-destructive' : ''}
              `}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`
                  w-full bg-transparent border-b border-input 
                  px-0 py-2 pr-10 focus:outline-none focus:border-primary 
                  transition-colors duration-200
                  ${errors.password ? 'border-destructive' : ''}
                `}
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 p-1 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-foreground text-background px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mx-auto" />
            ) : (
              '로그인'
            )}
          </motion.button>
        </form>

        {/* 회원가입 링크 */}
        {onSwitchToSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center pt-4"
          >
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-foreground hover:underline font-medium"
              >
                회원가입
              </button>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 