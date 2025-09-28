import React, { useState, memo, useCallback } from 'react';
import type { Message, Product } from '../types';
import ProductCard from './ProductCard';

interface MessageItemProps {
  message: Message;
  onPurchaseRequest: (product: Product) => void;
}

const MessageItem: React.FC<MessageItemProps> = memo(({ message, onPurchaseRequest }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.role === 'user';
  const isAI = message.role === 'ai';
  const isSystem = message.role === 'system';

  // TTS 기능
  const handleSpeak = useCallback(() => {
    if (!window.speechSynthesis) {
      alert('이 브라우저는 음성 출력을 지원하지 않습니다.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      message.content.replace(/\*\*/g, '').replace(/\n/g, ' ')
    );
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [message.content, isSpeaking]);

  if (isSystem) {
    return (
      <>
        {/* Mobile System Message */}
        <div className="text-center my-4 animate-scale-in md:hidden">
          <div className="mobile-system-message">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium">{message.content}</span>
            </div>
          </div>
        </div>

        {/* Desktop System Message */}
        <div className="text-center my-6 animate-scale-in hidden md:block">
          <div className="message-system inline-block px-4 py-2 text-sm font-medium">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{message.content}</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If the AI message contains a product, show a special card-based response
  if (isAI && message.product) {
    return (
      <>
        {/* Mobile AI Product Message */}
        <div className="my-3 md:hidden">
          <div className="mobile-ai-product-container">
            <div className="mobile-ai-header">
              <div className="mobile-ai-avatar">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold text-primary-600">AI 어시스턴트</span>
                    <span className="text-xs text-gray-500">• 맞춤 추천</span>
                  </div>

                  {/* Mobile Voice Button */}
                  {window.speechSynthesis && (
                    <button
                      onClick={handleSpeak}
                      className={`mobile-touch-target ${
                        isSpeaking
                          ? 'text-orange-600'
                          : 'text-gray-500'
                      }`}
                      title={isSpeaking ? "음성 출력 중지" : "음성으로 듣기"}
                    >
                      {isSpeaking ? (
                        <div className="w-3 h-3 border border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 7a1 1 0 012 0v10a1 1 0 11-2 0V7z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">✨ 고객님을 위해 최종 선택한 상품입니다</p>
              </div>
            </div>
            <div className="mt-3">
              <ProductCard product={message.product} onPurchaseRequest={onPurchaseRequest} />
            </div>
          </div>
        </div>

        {/* Desktop AI Product Message */}
        <div className="hidden md:flex my-6 justify-start">
          <div className="flex items-end max-w-3xl flex-row w-full">
            <div className="relative flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white animate-pulse-soft"></div>
            </div>

            <div className="message-ai p-6 w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-primary-600">AI 어시스턴트</span>
                  <span className="text-xs text-gray-500">• 맞춤 추천</span>
                </div>

                {/* Desktop Voice Button */}
                {window.speechSynthesis && (
                  <button
                    onClick={handleSpeak}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                      isSpeaking
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isSpeaking ? "음성 출력 중지" : "음성으로 듣기"}
                  >
                    {isSpeaking ? (
                      <>
                        <div className="w-3 h-3 border border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>중지</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 7a1 1 0 012 0v10a1 1 0 11-2 0V7z" />
                        </svg>
                        <span>듣기</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-base mb-6 leading-relaxed">✨ 고객님을 위해 최종적으로 선택한 상품입니다.</p>
              <ProductCard product={message.product} onPurchaseRequest={onPurchaseRequest} />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default message display for user and non-product AI messages
  return (
    <>
      {/* Mobile Message Bubbles */}
      <div className={`my-3 md:hidden ${isUser ? 'mobile-user-message' : 'mobile-ai-message'}`}>
        {isUser ? (
          <div className="mobile-user-bubble">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        ) : (
          <div className="mobile-ai-container">
            <div className="mobile-ai-header">
              <div className="mobile-ai-avatar">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold text-primary-600">AI 어시스턴트</span>
                    <span className="text-xs text-gray-500">• 실시간</span>
                  </div>

                  {/* Mobile Voice Button */}
                  {window.speechSynthesis && (
                    <button
                      onClick={handleSpeak}
                      className={`mobile-touch-target ${
                        isSpeaking
                          ? 'text-orange-600'
                          : 'text-gray-500'
                      }`}
                      title={isSpeaking ? "음성 출력 중지" : "음성으로 듣기"}
                    >
                      {isSpeaking ? (
                        <div className="w-3 h-3 border border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 7a1 1 0 012 0v10a1 1 0 11-2 0V7z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="mobile-ai-bubble">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Message Display */}
      <div className={`hidden md:flex my-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-end max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'} w-full`}>
          {!isUser && (
            <div className="relative flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white animate-pulse-soft"></div>
            </div>
          )}

          <div className={`p-4 w-full ${isUser ? 'message-user ml-4' : 'message-ai'}`}>
            {!isUser && (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-primary-600">AI 어시스턴트</span>
                  <span className="text-xs text-gray-500">• 실시간 응답</span>
                </div>

                {/* Desktop Voice Button */}
                {window.speechSynthesis && (
                  <button
                    onClick={handleSpeak}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-200 touch-target ${
                      isSpeaking
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isSpeaking ? "음성 출력 중지" : "음성으로 듣기"}
                  >
                    {isSpeaking ? (
                      <>
                        <div className="w-3 h-3 border border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>중지</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 7a1 1 0 012 0v10a1 1 0 11-2 0V7z" />
                        </svg>
                        <span>듣기</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
            <p className="text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>

          {isUser && (
            <div className="relative flex-shrink-0 ml-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default MessageItem;