import { Piece } from "../game/Piece.ts";

export class Bishop extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3);
  }

  move(position: string): void {
    this.position = position;
  }
}
