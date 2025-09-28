import React, { useState, useRef, useEffect } from 'react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

// Check for SpeechRecognition API
// FIX: Cast window to `any` to fix TypeScript error for non-standard browser APIs.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.log("Speech recognition not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    }

    recognitionRef.current = recognition;
  }, []);

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
  
  const toggleRecording = () => {
    if (!isSpeechRecognitionSupported || isLoading) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  }

  return (
    <footer className="glass border-t border-white/20 p-6 shrink-0 animate-slide-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30">
          {/* 음성 입력 버튼 */}
          {isSpeechRecognitionSupported && (
            <div className="relative">
              <button
                onClick={toggleRecording}
                disabled={isLoading}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  isRecording
                  ? 'bg-gradient-to-r from-error-500 to-error-600 text-white animate-pulse-soft shadow-lg shadow-error-500/30'
                  : 'btn-secondary hover-lift'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isRecording ? "녹음 중지" : "음성 입력"}
              >
                {isRecording ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>

              {isRecording && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-error-500 rounded-full animate-ping"></div>
              )}
            </div>
          )}

          {/* 텍스트 입력 */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "🎤 듣고 있어요..." : "무엇을 도와드릴까요? 메시지를 입력하거나 음성으로 말씀해주세요..."}
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
            className="btn-primary hover-lift px-8 py-3 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
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

        {/* 힌트 텍스트 */}
        <div className="flex items-center justify-center mt-3 space-x-6 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Enter로 빠른 전송</span>
          </span>
          {isSpeechRecognitionSupported && (
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>음성 입력 지원</span>
            </span>
          )}
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>AI 맞춤 추천</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default InputBar;
