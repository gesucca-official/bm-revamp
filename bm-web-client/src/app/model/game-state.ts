import {Move} from './move';
import {Player} from './player';

export interface GameState {
  gameId: string;
  players: Players;
  resolvedMoves: Move[];
  timeBasedEffects: TimeBasedEffects;
  over: boolean;
  winner: string;
  turn?: number;
  pendingMove?: Move;
  forfeits?: {[player: string]: string};
  moveDeadlines?: {[player: string]: number};
  reconnectDeadlines?: {[player: string]: number};
  outcomeReason?: string;
}

export interface Players {
  [id: string]: Player;
}

export interface TimeBasedEffects {
  [player: string]: string[];
}
