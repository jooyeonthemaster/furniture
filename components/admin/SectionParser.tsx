'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Check, AlertCircle } from 'lucide-react';

interface ParsedSection {
  type: 'overview' | 'targetUsers' | 'suitableSpaces' | 'designStory' | 'features' | 'specifications';
  content: string | string[];
  confidence: number;
}

interface SectionParserProps {
  rawText: string;
  onParsed: (sections: ParsedSection[]) => void;
  onTextChange: (text: string) => void;
}

const sectionKeywords = {
  overview: ['개요', '소개', '설명', '특징', '대표', '주요'],
  targetUsers: ['대상', '사용자', '고객', '추천', '적합', '타겟'],
  suitableSpaces: ['공간', '장소', '환경', '인테리어', '설치', '배치'],
  designStory: ['디자인', '스토리', '역사', '배경', '철학', '컨셉'],
  features: ['기능', '특성', '장점', '혜택', '이점'],
  specifications: ['사양', '규격', '크기', '치수', '무게', '소재']
};

const parseContent = (text: string): ParsedSection[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const sections: ParsedSection[] = [];
  
  let currentSection: ParsedSection | null = null;
  let currentContent: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 섹션 헤더 감지 (# 또는 ## 또는 키워드로 시작)
    const sectionMatch = trimmedLine.match(/^#+\s*(.+)$/) || 
                        Object.entries(sectionKeywords).find(([_, keywords]) => 
                          keywords.some(keyword => trimmedLine.includes(keyword))
                        );
    
    if (sectionMatch) {
      // 이전 섹션 저장
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentSection.type === 'overview' || currentSection.type === 'designStory' 
          ? currentContent.join(' ')
          : currentContent;
        sections.push(currentSection);
      }
      
      // 새 섹션 시작
      const sectionType = Array.isArray(sectionMatch) ? sectionMatch[0] : detectSectionType(trimmedLine);
      currentSection = {
        type: sectionType as ParsedSection['type'],
        content: '',
        confidence: calculateConfidence(trimmedLine, sectionType)
      };
      currentContent = [];
    } else if (currentSection && trimmedLine) {
      // 내용 추가
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
        currentContent.push(trimmedLine.replace(/^[-•*]\s*/, ''));
      } else {
        currentContent.push(trimmedLine);
      }
    }
  }
  
  // 마지막 섹션 저장
  if (currentSection && currentContent.length > 0) {
    currentSection.content = currentSection.type === 'overview' || currentSection.type === 'designStory' 
      ? currentContent.join(' ')
      : currentContent;
    sections.push(currentSection);
  }
  
  return sections;
};

const detectSectionType = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  for (const [type, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }
  
  return 'overview';
};

const calculateConfidence = (text: string, sectionType: string): number => {
  const keywords = sectionKeywords[sectionType as keyof typeof sectionKeywords] || [];
  const matches = keywords.filter(keyword => text.toLowerCase().includes(keyword)).length;
  return Math.min(matches / keywords.length * 100, 100);
};

export default function SectionParser({ rawText, onParsed, onTextChange }: SectionParserProps) {
  const [parsedSections, setParsedSections] = useState<ParsedSection[]>([]);
  const [isParseModalOpen, setIsParseModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleParse = () => {
    if (!rawText.trim()) return;
    
    const sections = parseContent(rawText);
    setParsedSections(sections);
    setIsParseModalOpen(true);
    onParsed(sections);
  };

  const handleCopySection = async (content: string | string[], index: number) => {
    const textContent = Array.isArray(content) ? content.join('\n') : content;
    await navigator.clipboard.writeText(textContent);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'overview': return '📋';
      case 'targetUsers': return '👥';
      case 'suitableSpaces': return '🏠';
      case 'designStory': return '✨';
      case 'features': return '⚡';
      case 'specifications': return '📐';
      default: return '📄';
    }
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'overview': return '상품 개요';
      case 'targetUsers': return '타겟 사용자';
      case 'suitableSpaces': return '적합한 공간';
      case 'designStory': return '디자인 스토리';
      case 'features': return '주요 기능';
      case 'specifications': return '제품 사양';
      default: return '기타';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          상품 설명 텍스트
          <span className="text-muted-foreground ml-2">
            (섹션별로 구분하여 작성하시면 자동으로 파싱됩니다)
          </span>
        </label>
        <textarea
          value={rawText}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
          rows={12}
          placeholder={`예시 형식:

# 상품 개요
Herman Miller Aeron Chair는 1994년 출시 이후 전 세계 오피스 가구의 혁신을 이끈 대표작입니다.

# 타겟 사용자
- 하루 6시간 이상 앉아서 근무하는 직장인
- 허리 건강이 중요한 30-50대 직업군
- 홈오피스를 운영하는 프리랜서

# 적합한 공간
- 개인 사무실 - 프리미엄한 공간 연출
- 홈오피스 - 거실이나 서재와 조화
- CEO룸 - 고급스러운 이미지 구축

# 디자인 스토리
Don Chadwick과 Bill Stumpf는 기존 의자의 한계를 뛰어넘어 인체공학적 설계로 Aeron을 개발했습니다.`}
        />
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleParse}
          disabled={!rawText.trim()}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-4 h-4" />
          <span>자동 파싱</span>
        </button>
        
        {parsedSections.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {parsedSections.length}개 섹션이 감지되었습니다
          </span>
        )}
      </div>

      {/* 파싱 결과 미리보기 */}
      {parsedSections.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="font-medium mb-3 flex items-center space-x-2">
            <span>파싱 결과 미리보기</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {parsedSections.length}개 섹션
            </span>
          </h3>
          
          <div className="grid gap-3">
            {parsedSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getSectionIcon(section.type)}</span>
                    <span className="font-medium">{getSectionTitle(section.type)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      section.confidence > 80 ? 'bg-green-100 text-green-800' :
                      section.confidence > 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(section.confidence)}% 신뢰도
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleCopySection(section.content, index)}
                    className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedIndex === index ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                
                <div className="text-sm">
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-1">
                      {(section.content as string[]).map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content as string}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 파싱 가이드 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-2">파싱 가이드</p>
            <ul className="space-y-1 text-blue-700">
              <li>• 섹션 제목은 # 또는 ## 를 사용하거나 키워드를 포함하세요</li>
              <li>• 목록은 - 또는 • 또는 * 를 사용하세요</li>
              <li>• 각 섹션 사이에는 빈 줄을 넣어주세요</li>
              <li>• 인식되는 섹션: 개요, 타겟사용자, 적합한공간, 디자인스토리, 기능, 사양</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 