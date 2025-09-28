import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: (userData: {
    email: string;
    name: string;
    phone?: string;
    preferences?: string[];
  }) => void;
  onSwitchToLogin: () => void;
  onBack: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin, onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    preferences: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shoppingCategories = [
    { id: 'electronics', label: '전자제품', icon: '📱' },
    { id: 'fashion', label: '패션/의류', icon: '👕' },
    { id: 'beauty', label: '뷰티/화장품', icon: '💄' },
    { id: 'home', label: '홈/리빙', icon: '🏠' },
    { id: 'sports', label: '스포츠/레저', icon: '⚽' },
    { id: 'books', label: '도서/문구', icon: '📚' },
    { id: 'food', label: '식품/건강', icon: '🥗' },
    { id: 'baby', label: '육아/출산', icon: '🍼' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2글자 이상 입력해주세요';
    }

    if (formData.phone && !/^[0-9-+\s()]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSignup({
      email: formData.email,
      name: formData.name.trim(),
      phone: formData.phone || undefined,
      preferences: formData.preferences
    });

    setIsLoading(false);
  };

  const togglePreference = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(categoryId)
        ? prev.preferences.filter(id => id !== categoryId)
        : [...prev.preferences, categoryId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <div className="mobile-header md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="mobile-touch-target text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-lg font-bold text-gray-900">회원가입</h1>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block pt-8 pb-4">
        <div className="max-w-md mx-auto px-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
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
            <p className="text-gray-600">새 계정을 만들어보세요</p>
          </div>

          {/* Mobile Title */}
          <div className="text-center mb-6 md:hidden">
            <h2 className="text-xl font-bold text-gray-900 mb-2">새 계정 만들기</h2>
            <p className="text-sm text-gray-600">AI 쇼핑의 새로운 경험을 시작하세요</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`input-primary w-full ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="example@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`input-primary w-full ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="홍길동"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호 <span className="text-gray-400">(선택사항)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`input-primary w-full ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="010-1234-5678"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Shopping Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                관심 쇼핑 카테고리 <span className="text-gray-400">(선택사항)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {shoppingCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => togglePreference(category.id)}
                    disabled={isLoading}
                    className={`flex items-center space-x-2 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.preferences.includes(category.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                선택한 카테고리에 맞는 상품을 우선적으로 추천해드려요
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
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
                    <span>계정 생성 중...</span>
                  </>
                ) : (
                  <>
                    <span>계정 만들기</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>

            {/* Switch to Login */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  disabled={isLoading}
                >
                  로그인하기
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;