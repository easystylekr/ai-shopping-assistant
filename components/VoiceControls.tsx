import React, { useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import VoiceButton from './VoiceButton';

interface VoiceControlsProps {
  onTranscriptComplete: (transcript: string) => void;
  onSpeakMessage: (message: string) => void;
  autoSpeak?: boolean;
  className?: string;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  onTranscriptComplete,
  onSpeakMessage,
  autoSpeak = false,
  className = '',
}) => {
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

  // 음성 인식 완료 시 콜백 호출
  useEffect(() => {
    if (transcript && !isListening) {
      const trimmedTranscript = transcript.trim();
      if (trimmedTranscript) {
        onTranscriptComplete(trimmedTranscript);
        resetTranscript();
      }
    }
  }, [transcript, isListening, onTranscriptComplete, resetTranscript]);

  // 외부에서 음성 출력 요청 시
  useEffect(() => {
    if (autoSpeak) {
      // 자동 음성 출력 로직은 부모 컴포넌트에서 직접 호출
    }
  }, [autoSpeak]);

  // 음성 출력 함수를 부모에게 전달
  useEffect(() => {
    onSpeakMessage(speak);
  }, [speak, onSpeakMessage]);

  if (!browserSupportsSpeech) {
    return (
      <div className={`text-center p-4 bg-yellow-50 rounded-lg ${className}`}>
        <p className="text-sm text-yellow-700">
          이 브라우저는 음성 기능을 지원하지 않습니다.
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Chrome, Safari, Edge 등 최신 브라우저를 사용해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* 음성 제어 버튼 */}
      <VoiceButton
        isListening={isListening}
        isSpeaking={isSpeaking}
        onStartListening={startListening}
        onStopListening={stopListening}
        onStopSpeaking={stopSpeaking}
      />

      {/* 음성 인식 상태 표시 */}
      {isListening && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-red-500 rounded animate-pulse"></div>
            <div className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>듣고 있습니다...</span>
        </div>
      )}

      {/* 실시간 음성 인식 텍스트 */}
      {transcript && isListening && (
        <div className="max-w-md p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">인식된 내용: </span>
            {transcript}
          </p>
        </div>
      )}

      {/* 음성 출력 상태 */}
      {isSpeaking && (
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <span>음성 출력 중...</span>
        </div>
      )}

      {/* 오류 메시지 */}
      {error && (
        <div className="max-w-md p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
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
        </div>
      )}

      {/* 음성 명령 가이드 */}
      <details className="max-w-md">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          음성 명령 도움말
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600">
          <p className="font-medium mb-2">음성 명령 예시:</p>
          <ul className="space-y-1">
            <li>• "스마트폰을 추천해줘"</li>
            <li>• "30만원 이하 노트북 찾아줘"</li>
            <li>• "가성비 좋은 헤드폰 추천"</li>
            <li>• "운동화 브랜드별로 비교해줘"</li>
          </ul>
          <p className="mt-2 text-gray-500">
            명확하고 구체적으로 말하면 더 정확한 추천을 받을 수 있습니다.
          </p>
        </div>
      </details>
    </div>
  );
};

export default VoiceControls;