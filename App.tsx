import React, { useState, useEffect } from 'react';
import type { Message, User, Product } from './types';
import { getAIResponse, generateProductImage } from './services/geminiService';
import { AdminService } from './services/adminService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import AuthModal from './components/AuthModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import IntroScreen from './components/IntroScreen';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

/**
 * Fetches a product image by generating it on-the-fly using an AI model.
 * This approach bypasses all CORS and hotlinking issues by creating a unique
 * image for each product recommendation.
 *
 * @param productName The name of the product to generate an image for.
 * @returns A promise that resolves to the product image URL (typically a base64 data URL).
 */
async function fetchProductImage(productName: string): Promise<string> {
  console.log(`[AI Image Gen] Generating image for: "${productName}"`);
  try {
    const imageUrl = await generateProductImage(productName);
    console.log(`[AI Image Gen] Image generation successful.`);
    return imageUrl;
  } catch (error) {
    console.error(`[AI Image Gen] Image generation failed:`, error);
    // Return a fallback placeholder if the generation fails.
    return `https://placehold.co/600x400/EFEFEF/333333?text=Image+Not+Available`;
  }
}


const parseProductFromResponse = (text: string): Omit<Product, 'imageUrl'> | null => {
  const nameMatch = text.match(/\*\*상품명:\*\*\s*(.*)/);
  const categoryMatch = text.match(/\*\*카테고리:\*\*\s*(.*)/);
  const priceMatch = text.match(/\*\*가격:\*\*\s*(.*)/);
  const ratingMatch = text.match(/\*\*상품평:\*\*\s*(.*)/);
  const reasonMatch = text.match(/\*\*추천 이유:\*\*\s*([\s\S]*)/);
  const linkMatch = text.match(/\*\*구매 링크:\*\*\s*(https?:\/\/[^\s]+)/);

  if (nameMatch && categoryMatch && priceMatch && linkMatch && reasonMatch && ratingMatch) {
    let description = reasonMatch[1].trim();
    
    const otherSections = ['**구매 링크:**'];
    for (const section of otherSections) {
      const index = description.indexOf(section);
      if (index !== -1) {
        description = description.substring(0, index).trim();
      }
    }

    return {
      name: nameMatch[1].trim(),
      category: categoryMatch[1].trim(),
      price: priceMatch[1].trim(),
      rating: ratingMatch[1].trim(),
      description: description,
      link: linkMatch[1].trim(),
    };
  }

  return null;
};


type AppState = 'intro' | 'login' | 'signup' | 'chat';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      content: '안녕하세요! AI 쇼핑 구매 대행 서비스입니다. 어떤 상품을 찾아드릴까요? 당신에게 딱 맞는 최고의 상품 하나를 찾아드리겠습니다.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // 컴포넌트 마운트 시 데모 데이터 생성 (개발용)
  useEffect(() => {
    AdminService.generateDemoData();
  }, []);

  // Effect to fetch product images when a new product is recommended
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'ai' && lastMessage.product && !lastMessage.product.imageUrl) {
      fetchProductImage(lastMessage.product.name).then(imageUrl => {
        setMessages(currentMessages => 
          currentMessages.map(msg => 
            msg.id === lastMessage.id 
            ? { ...msg, product: { ...msg.product!, imageUrl: imageUrl } } 
            : msg
          )
        );
      });
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    if (!user) {
        setShowAuthModal(true);
        return;
    }

    const newUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
    };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const aiResponseData = await getAIResponse(updatedMessages);
      const parsedProduct = parseProductFromResponse(aiResponseData.content);
      
      const newAiMessage: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiResponseData.content || "죄송합니다, 답변을 생성하지 못했습니다.",
        sources: aiResponseData.sources,
        product: parsedProduct ? { ...parsedProduct, imageUrl: '' } : undefined, // Initially set imageUrl to empty
      };
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseRequest = (product: Product) => {
    if (!user) return;

    // 구매 요청을 관리자 시스템에 저장
    const requestId = AdminService.savePurchaseRequest({
      userId: user.id || `user_${Date.now()}`,
      userEmail: user.email,
      product: product,
      status: 'pending',
    });

    const systemMessage: Message = {
        id: Date.now(),
        role: 'system',
        content: `'${product.name}' 상품에 대한 구매 대행 요청이 관리자에게 전송되었습니다. 요청 번호: ${requestId.slice(-8)}. 곧 연락드리겠습니다.`
    };
    setMessages(prev => [...prev, systemMessage]);
    console.log(`Purchase proxy request for ${product.name} saved with ID: ${requestId}`);
  };

  const handleLogin = (email: string) => {
    const newUser = { email };
    setUser(newUser);
    setShowAuthModal(false);
    setAppState('chat');

    // 사용자 정보를 관리자 시스템에 저장
    AdminService.saveUser(newUser);

    const welcomeMessage: Message = {
        id: Date.now(),
        role: 'system',
        content: `환영합니다, ${email}님! 이제부터 쇼핑을 시작할 수 있습니다.`
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  const handleSignup = (userData: {
    email: string;
    name: string;
    phone?: string;
    preferences?: string[];
  }) => {
    const newUser = {
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      preferences: userData.preferences
    };
    setUser(newUser);
    setAppState('chat');

    // 사용자 정보를 관리자 시스템에 저장
    AdminService.saveUser(newUser);

    const welcomeMessage: Message = {
        id: Date.now(),
        role: 'system',
        content: `${userData.name}님, 회원가입을 축하드립니다! 🎉 AI 쇼핑 어시스턴트가 당신만을 위한 완벽한 상품을 찾아드리겠습니다.`
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('intro');
    // 메시지 초기화
    setMessages([
      {
        id: 1,
        role: 'ai',
        content: '안녕하세요! AI 쇼핑 구매 대행 서비스입니다. 어떤 상품을 찾아드릴까요? 당신에게 딱 맞는 최고의 상품 하나를 찾아드리겠습니다.',
      },
    ]);
  };

  // 관리자 로그인 처리
  const handleAdminLogin = (password: string): boolean => {
    const isAuthenticated = AdminService.authenticateAdmin(password);
    if (isAuthenticated) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setShowAdminDashboard(true);
    }
    return isAuthenticated;
  };

  // 관리자 대시보드 닫기
  const handleAdminClose = () => {
    setShowAdminDashboard(false);
    setIsAdmin(false);
  };

  // 키보드 단축키로 관리자 로그인 (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowAdminLogin(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render different screens based on app state
  if (appState === 'intro') {
    return (
      <>
        <IntroScreen onGetStarted={() => setAppState('login')} />
        <PWAInstallPrompt />
      </>
    );
  }

  if (appState === 'login') {
    return (
      <>
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={() => setAppState('signup')}
          onBack={() => setAppState('intro')}
        />
        <PWAInstallPrompt />
      </>
    );
  }

  if (appState === 'signup') {
    return (
      <>
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => setAppState('login')}
          onBack={() => setAppState('intro')}
        />
        <PWAInstallPrompt />
      </>
    );
  }

  // Chat interface (appState === 'chat')
  return (
    <div className="mobile-app-container md:flex md:flex-col md:h-screen font-sans bg-gray-50">
      {/* Mobile Header */}
      <div className="mobile-header md:hidden">
        <div className="flex items-center justify-between w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">AI 쇼핑</span>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {user && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <button
                  onClick={handleLogout}
                  className="mobile-touch-target text-gray-600"
                  title="로그아웃"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header user={user} onLogin={() => setAppState('login')} onLogout={handleLogout} />
      </div>

      {/* Main Chat Area */}
      <div className="mobile-main md:flex-1">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onPurchaseRequest={handlePurchaseRequest}
          user={user}
          onLogin={() => setAppState('login')}
        />
      </div>

      {/* Mobile Input Area */}
      {user && (
        <div className="mobile-input-area md:hidden">
          <InputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            lastAIMessage={messages.length > 0 && messages[messages.length - 1].role === 'ai' ? messages[messages.length - 1].content : undefined}
          />
        </div>
      )}

      {/* Desktop Input Bar */}
      {user && (
        <div className="hidden md:block">
          <InputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            lastAIMessage={messages.length > 0 && messages[messages.length - 1].role === 'ai' ? messages[messages.length - 1].content : undefined}
          />
        </div>
      )}

      {/* Modals */}
      {showAuthModal && <AuthModal onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />}
      {showAdminLogin && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
      {showAdminDashboard && (
        <AdminDashboard
          onClose={handleAdminClose}
        />
      )}

      {/* PWA Install Prompt and Status */}
      <PWAInstallPrompt />
    </div>
  );
};

export default App;