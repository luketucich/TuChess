import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";

export class King extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, Infinity);
  }

  kingCollisionCheck(board: Board, move: number[]): boolean {
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

    for (const [rowOffset, colOffset] of directions) {
      const square = board.indexToSquare([
        // Get square
        move[0] + rowOffset,
        move[1] + colOffset,
      ]);

      if (board.squareIsValid(square)) {
        const piece = board.getSquare(square); // Get piece at square

        if (piece !== this && piece instanceof King) {
          // Check if piece is a king, and not the current king
          return true;
        }
      }
    }

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
        board.squareIsValid(moveAsSquare) && // Check if square is valid
        board.getSquare(moveAsSquare) === null && // Check if square is empty
        !this.kingCollisionCheck(board, move) // Check if king is colliding with another king
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
