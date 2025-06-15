import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit, Plus } from "lucide-react";
import SimpleGame from "@/components/SimpleGame";

interface GameBuilderProps {
  gameData: {
    gameId: number;
    interpretation: any;
    game: any;
    encouragement: string;
  };
  onNewGame: () => void;
}

export default function GameBuilder({ gameData, onNewGame }: GameBuilderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { interpretation, game } = gameData;

  return (
    <section className="mb-12" id="gameBuilder">
      <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-gray-800 mb-2 font-nunito">
            🎉 Your Game is Ready!
          </h3>
          <p className="text-xl text-gray-600">Here's what I built from your idea:</p>
        </div>

        {/* Game Title and Description */}
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-gray-800 mb-2 font-nunito">
            {interpretation.title}
          </h4>
          <p className="text-lg text-gray-600 mb-4">
            {interpretation.description}
          </p>
          <p className="text-md text-gray-600 italic">
            "{interpretation.encouragement}"
          </p>
        </div>

        {/* Game Preview Area */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 mb-6 min-h-96 relative overflow-hidden">
          
          {!isPlaying ? (
            // Game Preview
            <div className="relative w-full h-80 rounded-xl overflow-hidden" 
                 style={{ backgroundColor: interpretation.colors.background }}>
              
              {/* Preview overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button
                  onClick={() => setIsPlaying(true)}
                  className="bg-white rounded-full p-6 shadow-2xl hover:scale-110 transition-transform"
                  variant="ghost"
                >
                  <Play className="w-12 h-12 text-coral" />
                </Button>
              </div>
              
              {/* Game theme visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {interpretation.gameType === 'jumping' && '🐸'}
                    {interpretation.gameType === 'collection' && '⭐'}
                    {interpretation.gameType === 'racing' && '🏎️'}
                    {interpretation.gameType === 'puzzle' && '🧩'}
                    {interpretation.gameType === 'creative' && '🎨'}
                    {interpretation.gameType === 'adventure' && '🗺️'}
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {interpretation.character} Adventure
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Actual Game
            <SimpleGame 
              gameCode={game.gameCode}
              gameType={interpretation.gameType}
              config={interpretation}
              onBack={() => setIsPlaying(false)}
            />
          )}
          
          <div className="text-center mt-4">
            <p className="text-lg text-gray-600">
              {game.instructions}
            </p>
          </div>
        </div>

        {/* Game Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-success hover:bg-success/80 text-white font-bold py-4 px-6 rounded-2xl text-xl transform hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 mr-2" />
            {isPlaying ? 'Preview' : 'Play Game!'}
          </Button>
          
          <Button 
            onClick={onNewGame}
            className="bg-sky hover:bg-sky/80 text-white font-bold py-4 px-6 rounded-2xl text-xl transform hover:scale-105 transition-all"
          >
            <Edit className="w-5 h-5 mr-2" />
            Change It!
          </Button>
          
          <Button 
            onClick={onNewGame}
            className="bg-coral hover:bg-coral/80 text-white font-bold py-4 px-6 rounded-2xl text-xl transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Game!
          </Button>
        </div>
      </Card>
    </section>
  );
}
