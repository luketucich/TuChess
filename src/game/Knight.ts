import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";

export class Knight extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3);
  }

  getMoves(board: Board): string[] {
    const moves: string[] = [];
    const [row, col] = board.squareToIndex(this.position);
    const directions = [
      // Up
      [-2, -1], // Up left
      [2, -1], // Up right
    ];

    directions.forEach(([rowOffset, colOffset]) => {
      moves.push(board.indexToSquare([row + rowOffset, col + colOffset]));
    });

    return moves.filter((move) => board.squareIsValid(move));
  }

  move(position: string): void {
    this.position = position;
  }
}
