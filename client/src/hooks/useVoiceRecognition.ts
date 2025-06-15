import { useState, useEffect, useCallback, useRef } from "react";

interface UseVoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  continuous?: boolean;
  language?: string;
}

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceRecognition({
  onResult,
  onError,
  continuous = false,
  language = 'en-US'
}: UseVoiceRecognitionProps): UseVoiceRecognitionReturn {
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = "I had trouble hearing you.";
      switch (event.error) {
        case 'no-speech':
          errorMessage = "I didn't hear anything. Try speaking louder!";
          break;
        case 'audio-capture':
          errorMessage = "I can't access your microphone. Please check your settings.";
          break;
        case 'not-allowed':
          errorMessage = "Please allow microphone access to use voice features.";
          break;
        case 'network':
          errorMessage = "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again!";
      }
      
      onError(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported, continuous, language, onResult, onError]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      setTranscript("");
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      onError("Couldn't start listening. Please try again!");
    }
  }, [isSupported, onError]);

  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }, [isSupported]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript
  };
}
