import React, { useEffect, useRef } from 'react';
import type { Message, Product, User } from '../types';
import MessageItem from './MessageItem';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onPurchaseRequest: (product: Product) => void;
  user: User | null;
  onLogin: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onPurchaseRequest, user, onLogin }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <>
      {/* Mobile Chat Interface */}
      <div className="mobile-chat-container md:hidden">
        <div className="mobile-messages-area">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <MessageItem message={msg} onPurchaseRequest={onPurchaseRequest} />
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-slide-in-left px-4">
                <div className="mobile-ai-bubble">
                  <div className="loading-dots-mobile">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">AI가 답변 중...</span>
                </div>
              </div>
            )}

            {/* Mobile login prompt */}
            {!user && (
              <div className="flex justify-center mt-8 px-4 animate-scale-in">
                <div className="mobile-welcome-card">
                  <div className="mobile-welcome-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    AI 쇼핑 어시스턴트
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    맞춤형 상품 추천을 받으려면<br />
                    로그인해주세요
                  </p>
                  <button
                    onClick={onLogin}
                    className="mobile-btn mobile-btn-primary w-full"
                  >
                    로그인하고 시작하기
                  </button>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Desktop Chat Interface */}
      <main className="hidden md:flex flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto space-y-6 w-full">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className="animate-slide-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MessageItem message={msg} onPurchaseRequest={onPurchaseRequest} />
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-slide-in-left">
              <div className="message-ai p-4 max-w-lg">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span className="text-sm text-gray-500 ml-3">AI가 답변을 준비하고 있어요...</span>
              </div>
            </div>
          )}

          {/* Desktop login prompt */}
          {!user && (
            <div className="flex justify-center mt-12 animate-scale-in">
              <div className="card-elevated p-8 max-w-md text-center hover-lift">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur opacity-20"></div>
                  <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold gradient-text mb-3">
                  AI 쇼핑 어시스턴트와 대화하세요!
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  개인 맞춤형 상품 추천과 구매 대행 서비스를 이용하려면<br />
                  먼저 로그인해주세요.
                </p>
                <button
                  onClick={onLogin}
                  className="btn-primary hover-lift text-base px-8 py-3 w-full"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>로그인하고 쇼핑 시작하기</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>
    </>
  );
};

export default ChatWindow;