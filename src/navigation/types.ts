export type RootStackParamList = {
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
    targetScore: number;
  };
  GameHistory: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  AppStore: undefined;
}; 