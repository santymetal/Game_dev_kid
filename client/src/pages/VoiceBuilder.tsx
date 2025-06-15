import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import VoiceInterface from "@/components/VoiceInterface";
import GameBuilder from "@/components/GameBuilder";
import GameTemplates from "@/components/GameTemplates";
import { Settings } from "lucide-react";

interface GameData {
  gameId: number;
  interpretation: any;
  game: any;
  encouragement: string;
}

export default function VoiceBuilder() {
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGameGenerated = (gameData: GameData) => {
    setCurrentGame(gameData);
    toast({
      title: "🎉 Your game is ready!",
      description: gameData.encouragement,
    });
  };

  const handleNewGame = () => {
    setCurrentGame(null);
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, hsl(200, 71%, 55%) 0%, hsl(176, 62%, 55%) 100%)'}}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center text-white text-2xl">
              ✨
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-nunito">Voice Builder</h1>
          </div>
          <button className="text-gray-600 hover:text-gray-800 text-sm">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-nunito">
              Hi there, Super Creator! 🌟
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-6">
              Tell me what kind of game you want to play and I'll build it for you!
            </p>
            <div className="bg-sunny/30 rounded-2xl p-4 mb-4 text-center">
              <p className="text-lg text-gray-700 font-semibold">Try saying things like:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-gray-600">
                <p>"I want a jumping frog game"</p>
                <p>"Make a car racing game"</p>
                <p>"Create a puzzle with colors"</p>
                <p>"Draw and paint game"</p>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <div className="bg-sunny rounded-full p-4 bounce-gentle">
                💡
              </div>
            </div>
          </div>
        </section>

        {/* Voice Interface */}
        <VoiceInterface 
          onGameGenerated={handleGameGenerated}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Game Builder - shown when game is generated */}
        {currentGame && (
          <GameBuilder 
            gameData={currentGame}
            onNewGame={handleNewGame}
          />
        )}

        {/* Game Templates */}
        <GameTemplates />

        {/* Feedback Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-sunny/80 to-orange-200/80 rounded-3xl p-8 shadow-xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 font-nunito">🌟 You're Doing Great!</h3>
              <p className="text-xl text-gray-700 mb-6">
                Every great game starts with a great idea. Keep being creative!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/80 rounded-2xl p-4">
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="font-bold text-gray-800 mb-2 font-nunito">Speak Clearly</h4>
                  <p className="text-sm text-gray-600">Talk slow and clear so I can understand!</p>
                </div>
                
                <div className="bg-white/80 rounded-2xl p-4">
                  <div className="text-4xl mb-2">💭</div>
                  <h4 className="font-bold text-gray-800 mb-2 font-nunito">Be Creative</h4>
                  <p className="text-sm text-gray-600">Any idea is a good idea. Let your imagination fly!</p>
                </div>
                
                <div className="bg-white/80 rounded-2xl p-4">
                  <div className="text-4xl mb-2">🔄</div>
                  <h4 className="font-bold text-gray-800 mb-2 font-nunito">Try Again</h4>
                  <p className="text-sm text-gray-600">If I don't understand, just try again!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 font-nunito">Made with ❤️ for young creators</p>
        </div>
      </footer>
    </div>
  );
}
