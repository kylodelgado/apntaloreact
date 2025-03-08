export type RootStackParamList = {
  GameSetup: undefined;
  GamePlay: {
    gameMode: 'teams' | 'players';
    targetScore: number;
    teamNames?: string[];
    playerNames?: string[];
  };
  GameOver: {
    scores: number[][];
    winner: string;
    gameMode: 'teams' | 'players';
    targetScore: number;
  };
  Settings: undefined;
  GameHistory: undefined;
}; 