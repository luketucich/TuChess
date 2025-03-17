import { Move } from "./Move";

export interface KingMove extends Move {
  isCastle: boolean;
}
