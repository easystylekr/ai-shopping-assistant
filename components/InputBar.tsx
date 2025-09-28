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
    <footer className="bg-white border-t border-gray-200 p-4 shrink-0">
      <div className="max-w-4xl mx-auto flex items-center space-x-3">
        {isSpeechRecognitionSupported && (
          <button 
            onClick={toggleRecording}
            disabled={isLoading}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${
              isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 3a1 1 0 00-2 0v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 9.586V7z" clipRule="evenodd" />
              <path d="M10 18a5 5 0 005-5h-2a3 3 0 11-6 0H5a5 5 0 005 5z" />
            </svg>
          </button>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isRecording ? "듣고 있어요..." : "메시지를 입력하거나 마이크 버튼을 누르세요..."}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </div>
    </footer>
  );
};

export default InputBar;
