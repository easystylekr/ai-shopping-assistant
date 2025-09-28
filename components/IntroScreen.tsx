import React from 'react';

interface IntroScreenProps {
  onGetStarted: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8">
        {/* Logo and Branding */}
        <div className="text-center mb-8 md:mb-12 animate-scale-in">
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-lg opacity-20 animate-pulse-soft"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 leading-tight">
            AI 쇼핑 어시스턴트
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium">
            당신만을 위한 스마트한 쇼핑 파트너
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
          {/* Feature 1 */}
          <div className="mobile-card text-center hover-lift">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">음성으로 쇼핑</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              말만 하면 원하는 상품을<br />
              AI가 찾아드려요
            </p>
          </div>

          {/* Feature 2 */}
          <div className="mobile-card text-center hover-lift">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">맞춤 추천</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              AI가 당신의 취향을 분석해<br />
              완벽한 상품을 추천해요
            </p>
          </div>

          {/* Feature 3 */}
          <div className="mobile-card text-center hover-lift">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">구매 대행</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              복잡한 구매 과정을<br />
              전문가가 대신 처리해요
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center animate-slide-in-up">
          <button
            onClick={onGetStarted}
            className="btn-primary hover-lift text-lg px-8 py-4 md:px-12 md:py-5 font-bold relative overflow-hidden group shadow-2xl"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span>지금 시작하기</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>

          <p className="text-sm text-gray-500 mt-4">
            무료로 시작하세요 • 언제든 해지 가능
          </p>
        </div>
      </div>

      {/* Bottom Stats/Social Proof */}
      <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">10K+</div>
              <div className="text-xs text-gray-600">만족한 고객</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">95%</div>
              <div className="text-xs text-gray-600">추천 정확도</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">24/7</div>
              <div className="text-xs text-gray-600">AI 서비스</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;