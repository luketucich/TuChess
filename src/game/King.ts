import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";

export class King extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, Infinity);
  }

  checkKingCollision(board: Board, move: number[]): boolean {
    const directions: number[][] = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
      [-1, -1], // Up left
      [-1, 1], // Up right
      [1, -1], // Down left
      [1, 1], // Down right
    ];

    directions.forEach((direction) => {
      const [rowOffset, colOffset] = direction;
      const adjacentSquare = board.indexToSquare([
        move[0] + rowOffset,
        move[1] + colOffset,
      ]);

      if (board.getSquare(adjacentSquare) instanceof King) {
        return true;
      }
    });

    return false;
  }

  getMoves(board: Board): string[] {
    const moves: string[] = [];
    const [row, col]: number[] = board.squareToIndex(this.position);
    const directions: number[][] = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
      [-1, -1], // Up left
      [-1, 1], // Up right
      [1, -1], // Down left
      [1, 1], // Down right
    ];

    directions.forEach((direction) => {
      const [rowOffset, colOffset] = direction;
      const move = [row + rowOffset, col + colOffset];
      const moveAsSquare = board.indexToSquare([move[0], move[1]]);

      if (
        board.squareIsValid(moveAsSquare) &&
        board.getSquare(moveAsSquare) === null &&
        this.checkKingCollision(board, move) === false
      ) {
        moves.push(moveAsSquare);
      }
    });

    return moves;
  }

  move(position: string): void {
    this.position = position;
  }
}
