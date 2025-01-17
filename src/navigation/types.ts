export type RootStackParamList = {
  Home: undefined;
  GameSetup: undefined;
  GamePlay: {
    targetScore: number;
    gameMode: 'teams' | 'players';
    teamNames?: string[];
    playerNames?: string[];
  };
  GameOver: {
    scores: number[][];
    winner: string;
    gameMode: 'teams' | 'players';
  };
}; 