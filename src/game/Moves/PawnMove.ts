import { Move } from "./Move.ts";

export interface PawnMove extends Move {
  isPromotion?: boolean;
  promotionPiece?: "queen" | "rook" | "bishop" | "knight";
}
