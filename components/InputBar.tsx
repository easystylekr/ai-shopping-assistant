import React, { useState, useRef, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useTouch } from '../hooks/useTouch';
import VoiceButton from './VoiceButton';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  lastAIMessage?: string;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading, lastAIMessage }) => {
  const [text, setText] = useState('');
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const voiceButtonRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeech,
    isSpeaking,
    speak,
    stopSpeaking,
    error,
    clearError,
  } = useSpeech();

  // 음성 인식 완료 시 텍스트 입력란에 설정
  useEffect(() => {
    if (transcript && !isListening) {
      setText(transcript.trim());
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  // AI 응답을 자동으로 읽어주기 (선택적 기능)
  useEffect(() => {
    if (lastAIMessage && !isSpeaking && !isListening) {
      // 상품 추천 응답이 있을 때만 자동 읽기 (설정으로 제어 가능)
      const shouldAutoSpeak = localStorage.getItem('autoSpeak') === 'true';
      if (shouldAutoSpeak) {
        // AI 응답에서 마크다운 제거하고 읽기
        const cleanMessage = lastAIMessage.replace(/\*\*/g, '').replace(/\n/g, ' ');
        speak(cleanMessage);
      }
    }
  }, [lastAIMessage, speak, isSpeaking, isListening]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleAutoSpeak = () => {
    const current = localStorage.getItem('autoSpeak') === 'true';
    localStorage.setItem('autoSpeak', (!current).toString());
  };

  // Touch gestures for voice button
  const { touchHandlers: voiceTouchHandlers } = useTouch({
    onTap: handleVoiceInput,
    onLongPress: () => {
      // Long press to show voice help on mobile
      if (window.innerWidth < 768) {
        setShowVoiceHelp(!showVoiceHelp);
      }
    },
    onSwipeUp: () => {
      // Swipe up to start listening
      if (!isListening && !isSpeaking) {
        startListening();
      }
    },
    onSwipeDown: () => {
      // Swipe down to stop listening or speaking
      if (isListening) {
        stopListening();
      } else if (isSpeaking) {
        stopSpeaking();
      }
    }
  }, {
    threshold: 30,
    longPressTime: 800
  });

  // Touch gestures for input area
  const { touchHandlers: inputTouchHandlers } = useTouch({
    onSwipeRight: () => {
      // Swipe right to send message
      if (text.trim() && !isLoading) {
        handleSend();
      }
    },
    onSwipeLeft: () => {
      // Swipe left to clear input
      if (text.trim()) {
        setText('');
      }
    },
    onSwipeUp: () => {
      // Swipe up to start voice input
      if (browserSupportsSpeech && !isListening && !isSpeaking) {
        startListening();
      }
    }
  }, {
    threshold: 50,
    preventScroll: false
  });

  return (
    <footer className="glass border-t border-white/20 p-3 md:p-6 shrink-0 animate-slide-in-up safe-area-bottom">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 md:space-x-4 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-white/30">
          {/* 음성 제어 버튼 */}
          {browserSupportsSpeech && (
            <div
              ref={voiceButtonRef}
              className="flex items-center space-x-2"
              {...voiceTouchHandlers}
            >
              <VoiceButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                onStartListening={startListening}
                onStopListening={stopListening}
                onStopSpeaking={stopSpeaking}
                disabled={isLoading}
                className="w-10 h-10 md:w-12 md:h-12 px-0 py-0 touch-target"
              />

              {/* 음성 설정 버튼 - 모바일에서는 숨김 */}
              <button
                onClick={() => setShowVoiceHelp(!showVoiceHelp)}
                className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="음성 설정"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          )}

          {/* 텍스트 입력 */}
          <div className="flex-1 relative" {...inputTouchHandlers}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "🎤 듣고 있어요..." : transcript ? "음성 인식 완료! Enter를 눌러 전송하세요." : "무엇을 도와드릴까요? 메시지를 입력하거나 음성으로 말씀해주세요..."}
              className="input-primary w-full pr-4"
              disabled={isLoading}
            />

            {/* 입력 상태 표시 */}
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
          </div>

          {/* 전송 버튼 */}
          <button
            onClick={handleSend}
            disabled={isLoading || !text.trim()}
            className="btn-primary hover-lift px-4 md:px-8 py-2 md:py-3 text-sm md:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group touch-target"
            title="메시지 전송"
          >
            <span className="relative z-10 flex items-center space-x-2">
              {isLoading ? (
                <>
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span>처리 중...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>전송</span>
                </>
              )}
            </span>

            {/* 호버 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="ml-2 text-red-600 hover:text-red-800"
              title="오류 메시지 닫기"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* 음성 설정 패널 */}
        {showVoiceHelp && browserSupportsSpeech && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-900">음성 설정</h3>
              <button
                onClick={() => setShowVoiceHelp(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {/* 자동 음성 출력 설정 */}
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localStorage.getItem('autoSpeak') === 'true'}
                  onChange={toggleAutoSpeak}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-800">AI 응답 자동 읽기</span>
              </label>

              {/* 음성 명령 가이드 */}
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-2">음성 명령 예시:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>• "스마트폰 추천해줘"</div>
                  <div>• "30만원 노트북 찾아줘"</div>
                  <div>• "헤드폰 비교해줘"</div>
                  <div>• "운동화 브랜드별로"</div>
                </div>
              </div>

              {/* 음성 상태 표시 */}
              {isListening && (
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-blue-500 rounded animate-pulse"></div>
                    <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-3 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>음성 인식 중...</span>
                </div>
              )}

              {isSpeaking && (
                <div className="flex items-center space-x-2 text-sm text-orange-700">
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>음성 출력 중...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 힌트 텍스트 - 모바일에서는 터치 제스처 포함 */}
        <div className="flex items-center justify-center mt-2 md:mt-3 space-x-3 md:space-x-6 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden sm:inline">Enter로 빠른 전송</span>
            <span className="sm:hidden">Enter/스와이프→</span>
          </span>
          {browserSupportsSpeech && (
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="hidden sm:inline">음성 입력/출력 지원</span>
              <span className="sm:hidden">터치/스와이프</span>
            </span>
          )}
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">AI 맞춤 추천</span>
            <span className="sm:hidden">AI 추천</span>
          </span>
        </div>

        {/* Mobile Touch Gesture Hints */}
        <div className="md:hidden mt-2 text-center">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center justify-center space-x-4">
              <span>↑ 음성시작</span>
              <span>↓ 음성중지</span>
              <span>→ 전송</span>
              <span>← 지우기</span>
              <span>길게누르기 설정</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default InputBar;
