export type RootStackParamList = {
  Home: undefined;
  GameSetup: undefined;
  GameHistory: undefined;
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
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  AppStore: undefined;
}; 