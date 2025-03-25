import { Board } from "../game/Board";
import { Player } from "../game/Player";

export interface User {
  id: string;
  authId?: string;
  username?: string;
  color?: string;
  isConnected: boolean;
}

export interface Game {
  board: Board;
  serializedBoard: string;
  turn: string;
  gameOver: boolean;
  white: Player;
  black: Player;
  timeControl: TimeControl;
  whiteTime: number;
  whiteClockId?: NodeJS.Timeout;
  blackTime: number;
  blackClockId?: NodeJS.Timeout;
}

export interface TimeControl {
  time: number;
  increment: number;
}

export interface GameState {
  serializedBoard: string;
  turn: string;
  gameOver: boolean;
  whiteTime: number;
  blackTime: number;
  increment: number;
}
