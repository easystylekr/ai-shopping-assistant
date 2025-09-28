import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechReturn {
  // 음성 인식 (STT)
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeech: boolean;

  // 음성 출력 (TTS)
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;

  // 오류 처리
  error: string | null;
  clearError: () => void;
}

export const useSpeech = (): UseSpeechReturn => {
  // STT 상태
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // TTS 상태
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // 공통 상태
  const [error, setError] = useState<string | null>(null);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(false);

  // 브라우저 지원 확인
  useEffect(() => {
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    setBrowserSupportsSpeech(!!(speechRecognition && speechSynthesis));

    if (speechSynthesis) {
      synthRef.current = speechSynthesis;
    }

    if (speechRecognition) {
      const recognition = new speechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(`음성 인식 오류: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // STT 기능
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('음성 인식이 지원되지 않는 브라우저입니다.');
      return;
    }

    try {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('음성 인식을 시작할 수 없습니다.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // TTS 기능
  const speak = useCallback((text: string) => {
    if (!synthRef.current) {
      setError('음성 출력이 지원되지 않는 브라우저입니다.');
      return;
    }

    try {
      // 기존 음성 중지
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError('음성 출력 중 오류가 발생했습니다.');
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Failed to speak:', error);
      setError('음성 출력을 시작할 수 없습니다.');
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // STT
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeech,

    // TTS
    isSpeaking,
    speak,
    stopSpeaking,

    // 오류 처리
    error,
    clearError,
  };
};

// 타입 확장 (TypeScript용)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}