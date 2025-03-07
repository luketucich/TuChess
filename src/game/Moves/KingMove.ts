import { Move } from "./Move.ts";

export interface KingMove extends Move {
  isCastle?: boolean;
}
