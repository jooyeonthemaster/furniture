'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, FileText, Building, User, Mail, Phone, MapPin, CreditCard, Star, TrendingUp } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const dealerBenefits = [
  { icon: TrendingUp, title: '높은 수익성', description: '업계 최고 수준의 수수료율' },
  { icon: User, title: '전담 매니저', description: '1:1 전담 매니저 배정' },
  { icon: Star, title: '브랜드 신뢰성', description: 'LUXE 브랜드 보증' },
  { icon: CreditCard, title: '정산 시스템', description: '투명하고 빠른 정산' }
];

const requirements = [
  '사업자등록증 보유 (개인사업자 또는 법인)',
  '가구 관련 사업 경력 1년 이상',
  '정품 가구만 취급',
  '고객 서비스 품질 유지'
];

export default function DealerRegisterPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    businessNumber: '',
    representativeName: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    experienceYears: '',
    brands: '',
    description: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const [files, setFiles] = useState({
    businessLicense: null as File | null,
    bankStatement: null as File | null,
    portfolio: null as File | null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0] || null;
    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '회사명을 입력해주세요';
    }

    if (!formData.businessNumber.trim()) {
      newErrors.businessNumber = '사업자등록번호를 입력해주세요';
    }

    if (!formData.representativeName.trim()) {
      newErrors.representativeName = '대표자명을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    }

    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }

    if (!formData.businessType) {
      newErrors.businessType = '사업 유형을 선택해주세요';
    }

    if (!formData.experienceYears) {
      newErrors.experienceYears = '경력을 선택해주세요';
    }

    if (!files.businessLicense) {
      newErrors.businessLicense = '사업자등록증을 첨부해주세요';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '딜러 약관에 동의해주세요';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 딜러 등록 처리 로직
      console.log('딜러 등록 데이터:', formData, files);
      alert('딜러 등록 신청이 완료되었습니다! 검토 후 연락드리겠습니다.');
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            딜러 등록
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            LUXE와 함께 프리미엄 가구 시장에서 성공하세요
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl xs:text-xl font-light mb-8 text-center">
            딜러 파트너의 특별한 혜택
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {dealerBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-background" />
                </div>
                <h3 className="font-medium mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-70">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 xs:py-12 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl xs:text-xl font-light mb-8 text-center">
            딜러 등록 요건
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((requirement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 bg-background rounded-lg"
              >
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-sm">{requirement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-light mb-8 text-center">딜러 등록 신청</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 회사 정보 */}
              <div>
                <h3 className="text-lg font-medium mb-6 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  회사 정보
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">회사명 *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="회사명을 입력하세요"
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">사업자등록번호 *</label>
                    <input
                      type="text"
                      name="businessNumber"
                      value={formData.businessNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                        errors.businessNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="000-00-00000"
                    />
                    {errors.businessNumber && <p className="text-red-500 text-xs mt-1">{errors.businessNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">사업 유형 *</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                        errors.businessType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">사업 유형 선택</option>
                      <option value="retailer">소매업</option>
                      <option value="wholesaler">도매업</option>
                      <option value="interior">인테리어업</option>
                      <option value="importer">수입업</option>
                    </select>
                    {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">경력 *</label>
                    <select
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                        errors.experienceYears ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">경력 선택</option>
                      <option value="1-3">1-3년</option>
                      <option value="3-5">3-5년</option>
                      <option value="5-10">5-10년</option>
                      <option value="10+">10년 이상</option>
                    </select>
                    {errors.experienceYears && <p className="text-red-500 text-xs mt-1">{errors.experienceYears}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">주소 *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="사업장 주소를 입력하세요"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* 담당자 정보 */}
              <div>
                <h3 className="text-lg font-medium mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  담당자 정보
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">대표자명 *</label>
                    <input
                      type="text"
                      name="representativeName"
                      value={formData.representativeName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                        errors.representativeName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="대표자명을 입력하세요"
                    />
                    {errors.representativeName && <p className="text-red-500 text-xs mt-1">{errors.representativeName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">연락처 *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="010-0000-0000"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">이메일 *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-foreground ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* 사업 세부사항 */}
              <div>
                <h3 className="text-lg font-medium mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  사업 세부사항
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">취급 브랜드</label>
                    <input
                      type="text"
                      name="brands"
                      value={formData.brands}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-foreground"
                      placeholder="Herman Miller, B&B Italia, Cassina 등"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">사업 소개</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-foreground"
                      placeholder="회사 소개 및 사업 특징을 작성해주세요"
                    />
                  </div>
                </div>
              </div>

              {/* 첨부 서류 */}
              <div>
                <h3 className="text-lg font-medium mb-6 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  첨부 서류
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">사업자등록증 *</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'businessLicense')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    {errors.businessLicense && <p className="text-red-500 text-xs mt-1">{errors.businessLicense}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">통장 사본</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'bankStatement')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">포트폴리오</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'portfolio')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-6 border-t">
                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <span className="text-sm">
                      <span className="text-red-500">*</span> 딜러 계약 약관에 동의합니다
                      <Link href="/dealer/terms" className="text-foreground underline ml-2">보기</Link>
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-red-500 text-xs mt-1 ml-6">{errors.agreeTerms}</p>}
                </div>

                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <span className="text-sm">
                      <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
                      <Link href="/privacy" className="text-foreground underline ml-2">보기</Link>
                    </span>
                  </label>
                  {errors.agreePrivacy && <p className="text-red-500 text-xs mt-1 ml-6">{errors.agreePrivacy}</p>}
                </div>
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full py-4 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-medium text-lg"
              >
                딜러 등록 신청
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl xs:text-xl font-light mb-8">
            딜러 등록 프로세스
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">신청서 제출</h3>
              <p className="text-sm opacity-70">온라인 신청서 작성 및 서류 첨부</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">서류 검토</h3>
              <p className="text-sm opacity-70">영업일 기준 3-5일 소요</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">면담 진행</h3>
              <p className="text-sm opacity-70">담당자와 사업 계획 상담</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold">4</span>
              </div>
              <h3 className="font-medium mb-2">계약 체결</h3>
              <p className="text-sm opacity-70">딜러 계약 및 시스템 연동</p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-sm opacity-70 mb-4">
              문의사항이 있으시다면 언제든지 연락주세요
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 opacity-60" />
                <span className="text-sm">1588-1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 opacity-60" />
                <span className="text-sm">dealer@luxe.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 