import { Card } from "@/components/ui/card";

const gameTemplates = [
  {
    id: 'jumping',
    title: 'Jumping Games',
    description: 'Characters that hop and jump!',
    icon: '🐸',
    color: 'bg-coral'
  },
  {
    id: 'puzzle',
    title: 'Puzzle Games', 
    description: 'Match colors and solve puzzles!',
    icon: '🧩',
    color: 'bg-turquoise'
  },
  {
    id: 'racing',
    title: 'Racing Games',
    description: 'Fast cars and fun races!',
    icon: '🏎️',
    color: 'bg-sky'
  },
  {
    id: 'creative',
    title: 'Creative Tools',
    description: 'Draw and create art!',
    icon: '🎨',
    color: 'bg-lavender'
  }
];

interface GameTemplatesProps {
  onTemplateSelect?: (templateId: string) => void;
}

export default function GameTemplates({ onTemplateSelect }: GameTemplatesProps) {
  
  const handleTemplateClick = (templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4 font-nunito">🎮 Game Ideas to Get Started</h3>
        <p className="text-xl text-white/90">Click on any game type and tell me your idea!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gameTemplates.map((template) => (
          <Card
            key={template.id}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => handleTemplateClick(template.id)}
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${template.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                {template.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2 font-nunito">{template.title}</h4>
              <p className="text-gray-600">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
