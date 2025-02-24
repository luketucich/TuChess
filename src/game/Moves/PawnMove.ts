import { Move } from "./Move.ts";

export interface PawnMove extends Move {
  isDoubleMove?: boolean;
  isPromotion: boolean;
  promotionPiece?: "queen" | "rook" | "bishop" | "knight";
}
