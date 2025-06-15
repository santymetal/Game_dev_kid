import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface GenerateGameRequest {
  transcript: string;
}

interface GenerateGameResponse {
  success: boolean;
  gameId: number;
  interpretation: any;
  game: any;
  encouragement: string;
}

interface UseGameGenerationOptions {
  onSuccess?: (data: GenerateGameResponse) => void;
  onError?: (error: Error) => void;
}

export function useGameGeneration({ onSuccess, onError }: UseGameGenerationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateGameRequest): Promise<GenerateGameResponse> => {
      const response = await apiRequest('POST', '/api/voice/process', data);
      return await response.json();
    },
    
    onSuccess: (data) => {
      // Invalidate and refetch recent games
      queryClient.invalidateQueries({ queryKey: ['/api/games/recent'] });
      
      if (onSuccess) {
        onSuccess(data);
      }
    },
    
    onError: (error) => {
      console.error('Game generation error:', error);
      
      if (onError) {
        onError(error);
      }
    }
  });
}

export function useEncouragement() {
  return useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      const response = await apiRequest('GET', '/api/encouragement');
      return await response.json();
    }
  });
}
