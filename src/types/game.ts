export interface Player {
  id: string;
  name: string;
  scores: number[];
  total: number;
}

export interface Team {
  id: string;
  name: string;
  players: string[]; // player names
  scores: number[];
  total: number;
}

export interface GameState {
  mode: 'teams' | 'players';
  targetScore: number;
  teams?: Team[];
  players?: Player[];
  currentRound: number;
  isGameOver: boolean;
} 