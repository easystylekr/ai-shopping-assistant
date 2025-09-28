import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string) => void;
  onSwitchToSignup: () => void;
  onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup, onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일을 입력해주세요');
      return;
    }

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    onLogin(email);
    setIsLoading(false);
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onLogin(demoEmail);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <div className="mobile-header md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="mobile-touch-target text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-lg font-bold text-gray-900">로그인</h1>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block pt-8 pb-4">
        <div className="max-w-md mx-auto px-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로 가기
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 pb-8">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8 hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 쇼핑 어시스턴트</h2>
            <p className="text-gray-600">계정에 로그인하세요</p>
          </div>

          {/* Mobile Title */}
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-xl font-bold text-gray-900 mb-2">다시 만나서 반가워요!</h2>
            <p className="text-sm text-gray-600">AI 쇼핑을 계속 이용하려면 로그인하세요</p>
          </div>

          {/* Quick Demo Access */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              빠른 체험하기
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickLogin('demo@aishopping.com')}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-blue-900">데모 계정으로 체험</div>
                <div className="text-xs text-blue-600">demo@aishopping.com</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-primary w-full ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="example@email.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="mobile-btn mobile-btn-primary w-full py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span>로그인 중...</span>
                  </>
                ) : (
                  <>
                    <span>로그인</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>

            {/* Additional Info */}
            <div className="space-y-4">
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>

              {/* Features Reminder */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">로그인하면 이용할 수 있어요</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI 맞춤 상품 추천
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    음성 쇼핑 기능
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    전문가 구매 대행
                  </div>
                </div>
              </div>
            </div>

            {/* Switch to Signup */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  disabled={isLoading}
                >
                  회원가입하기
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;