import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useGameGeneration } from "@/hooks/useGameGeneration";
import { useToast } from "@/hooks/use-toast";

interface VoiceInterfaceProps {
  onGameGenerated: (gameData: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function VoiceInterface({ onGameGenerated, isLoading, setIsLoading }: VoiceInterfaceProps) {
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceRecognition({
    onResult: (result) => {
      setTranscript(result);
    },
    onError: (error) => {
      console.error("Voice recognition error:", error);
      toast({
        title: "Oops! I didn't hear that",
        description: "Try again! Make sure to speak clearly. 😊",
        variant: "destructive",
      });
    }
  });

  const { mutate: generateGame } = useGameGeneration({
    onSuccess: (data) => {
      setIsLoading(false);
      onGameGenerated(data);
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "I had trouble with that",
        description: "Can you try saying your idea again? 🤔",
        variant: "destructive",
      });
    }
  });

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        setIsLoading(true);
        generateGame({ transcript: transcript.trim() });
      }
    } else {
      setTranscript("");
      startListening();
    }
  };

  const getStatusMessage = () => {
    if (isLoading) return "🤔 Thinking about your idea...";
    if (isListening) return "🎤 I'm listening... speak your idea!";
    return "Ready to listen to your idea!";
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-white animate-spin mb-3" />
          <p className="text-white font-bold text-xl">Building...</p>
        </div>
      );
    }
    
    if (isListening) {
      return (
        <div className="text-center">
          <MicOff className="w-16 h-16 text-white mb-3" />
          <p className="text-white font-bold text-xl">Listening...</p>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <Mic className="w-16 h-16 text-white mb-3" />
        <p className="text-white font-bold text-xl">Talk to Me!</p>
      </div>
    );
  };

  if (!isSupported) {
    return (
      <section className="mb-12">
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Voice not available 🎤
            </h3>
            <p className="text-lg text-gray-600">
              Ask a grown-up to help you use a modern web browser! 👨‍👩‍👧‍👦
            </p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        
        {/* Voice Status Display */}
        <div className="text-center mb-8">
          <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-nunito">
            {getStatusMessage()}
          </div>
          
          {/* Voice Visualization */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            {[0, 0.2, 0.4, 0.6, 0.8].map((delay, index) => (
              <div
                key={index}
                className={`w-4 rounded-full bg-turquoise ${
                  isListening ? 'voice-wave' : ''
                }`}
                style={{
                  height: isListening ? '48px' : '12px',
                  animationDelay: `${delay}s`,
                  transition: 'height 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Voice Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleVoiceToggle}
            disabled={isLoading}
            className={`w-48 h-48 bg-gradient-to-br from-coral to-turquoise rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ${
              isListening ? 'listening-glow' : ''
            }`}
          >
            {getButtonContent()}
          </Button>
        </div>

        {/* Voice Transcript Display */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center font-nunito">
            💬 What you said:
          </h3>
          <div className="min-h-20 text-lg text-gray-600 italic">
            {transcript || "Start talking and your words will appear here!"}
          </div>
        </div>

        {/* Helper Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-sunny/20 rounded-2xl p-4 border-2 border-sunny">
            <h4 className="font-bold text-gray-700 mb-2 font-nunito">💡 Need ideas? Try saying:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>"Make a jumping game with a frog"</li>
              <li>"Create a color matching puzzle"</li>
              <li>"Build a racing game with cars"</li>
            </ul>
          </div>
          <div className="bg-mint/20 rounded-2xl p-4 border-2 border-mint">
            <h4 className="font-bold text-gray-700 mb-2 font-nunito">🎮 What I can build:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Simple games with characters</li>
              <li>Puzzles and matching games</li>
              <li>Drawing and creative tools</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}
