import React from 'react';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  disabled?: boolean;
  className?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  disabled = false,
  className = '',
}) => {
  const handleClick = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const getButtonContent = () => {
    if (isSpeaking) {
      return (
        <>
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm">음성 중지</span>
        </>
      );
    }

    if (isListening) {
      return (
        <>
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm">녹음 중지</span>
        </>
      );
    }

    return (
      <>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <span className="text-sm">음성 입력</span>
      </>
    );
  };

  const getButtonClass = () => {
    const baseClass = `
      flex items-center gap-2 px-4 py-2 rounded-lg
      transition-all duration-200 font-medium text-sm
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${className}
    `;

    if (disabled) {
      return `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }

    if (isSpeaking) {
      return `${baseClass} bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500`;
    }

    if (isListening) {
      return `${baseClass} bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 animate-pulse`;
    }

    return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={getButtonClass()}
      title={
        isSpeaking
          ? "음성 출력 중지"
          : isListening
            ? "음성 인식 중지"
            : "음성 입력 시작"
      }
    >
      {getButtonContent()}
    </button>
  );
};

export default VoiceButton;