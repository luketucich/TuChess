import { Piece } from "../game/Piece.ts";

export class Rook extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 5);
  }

  move(position: string): void {
    this.position = position;
  }
}
