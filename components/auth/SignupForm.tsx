'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, User, Briefcase } from 'lucide-react';
import { useAuth } from '@/components/providers/ClientProviders';
import GoogleLoginButton from './GoogleLoginButton';
import type { UserRole } from '@/types';

interface SignupFormProps {
  defaultRole?: UserRole;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const roleConfig = {
  customer: {
    label: '고객',
    description: '가구를 구매하고 싶어요',
    icon: User
  },
  dealer: {
    label: '딜러',
    description: '상품을 판매하고 싶어요',
    icon: Briefcase
  }
};

export default function SignupForm({ 
  defaultRole = 'customer',
  onSuccess,
  onSwitchToLogin 
}: SignupFormProps) {
  const { signUpWithEmail, error: authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole as UserRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2글자 이상이어야 합니다.';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6글자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await signUpWithEmail(
        formData.email, 
        formData.password, 
        formData.name.trim(), 
        formData.role
      );
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

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl xs:text-2xl font-light mb-2">회원가입</h1>
        <p className="text-muted-foreground">LUXE와 함께 시작하세요</p>
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
        {/* 구글 회원가입 */}
        <GoogleLoginButton
          role={formData.role}
          onSuccess={onSuccess}
          text="Google로 회원가입"
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

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 역할 선택 */}
          <div>
            <label className="block text-sm font-medium mb-3">계정 유형</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(roleConfig).map(([role, config]) => {
                const IconComponent = config.icon;
                return (
                  <motion.button
                    key={role}
                    type="button"
                    onClick={() => handleInputChange('role', role)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-3 border rounded-lg text-left transition-all duration-200
                      ${formData.role === role 
                        ? 'border-foreground bg-muted' 
                        : 'border-border hover:border-muted-foreground'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-sm">{config.label}</div>
                        <div className="text-xs text-muted-foreground">{config.description}</div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`
                w-full bg-transparent border-b border-input 
                px-0 py-2 focus:outline-none focus:border-primary 
                transition-colors duration-200
                ${errors.name ? 'border-destructive' : ''}
              `}
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

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
                placeholder="6글자 이상"
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

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`
                  w-full bg-transparent border-b border-input 
                  px-0 py-2 pr-10 focus:outline-none focus:border-primary 
                  transition-colors duration-200
                  ${errors.confirmPassword ? 'border-destructive' : ''}
                `}
                placeholder="비밀번호를 다시 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-2 p-1 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
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
              '회원가입'
            )}
          </motion.button>
        </form>

        {/* 로그인 링크 */}
        {onSwitchToLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center pt-4"
          >
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-foreground hover:underline font-medium"
              >
                로그인
              </button>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 