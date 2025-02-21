import { Piece } from "../game/Piece.ts";

export class Queen extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 9);
  }

  move(position: string): void {
    this.position = position;
  }
}
