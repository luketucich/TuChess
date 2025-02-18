import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";

export class Bishop extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3);
  }

  getMoves(board: Board): string[] {
    const moves: string[] = [];
    const [row, col]: number[] = board.squareToIndex(this.position);
    const directions: number[][] = [
      [-1, -1], // Up left
      [-1, 1], // Up right
      [1, -1], // Down left
      [1, 1], // Down right
    ];

    directions.forEach((direction) => {
      const [rowOffset, colOffset] = direction;

      let move: number[] = [row + rowOffset, col + colOffset];
      let moveAsSquare = board.indexToSquare([move[0], move[1]]);

      while (
        board.squareIsValid(moveAsSquare) &&
        board.getSquare(moveAsSquare) === null
      ) {
        moves.push(moveAsSquare);

        // Move to next square in direction
        move = [move[0] + rowOffset, move[1] + colOffset];
        moveAsSquare = board.indexToSquare([move[0], move[1]]);
      }
    });

    return moves;
  }

  move(position: string): void {
    this.position = position;
  }
}
