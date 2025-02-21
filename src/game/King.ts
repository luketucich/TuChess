import { Piece } from "../game/Piece.ts";

export class King extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, Infinity);
  }

  move(position: string): void {
    this.position = position;
  }
}
