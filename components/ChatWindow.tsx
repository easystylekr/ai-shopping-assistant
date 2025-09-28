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
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} onPurchaseRequest={onPurchaseRequest} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3 max-w-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}

        {/* 로그인하지 않은 상태에서 로그인 유도 메시지 */}
        {!user && (
          <div className="flex justify-center mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md text-center">
              <div className="text-blue-600 mb-2">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                AI 쇼핑 어시스턴트와 대화하세요!
              </h3>
              <p className="text-gray-600 mb-4">
                상품 추천과 구매 대행 서비스를 이용하려면 먼저 로그인해주세요.
              </p>
              <button
                onClick={onLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                로그인하고 쇼핑 시작하기
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatWindow;