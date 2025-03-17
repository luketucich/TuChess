import { Piece } from "./Piece";
import { Board, BoardSquare } from "../Board";
import { Move } from "../Moves/Move";
import { King } from "./King";

export class Knight extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3, "knight");
  }

  move(position: string): void {
    this.position = position;
  }

  getMoves(board: Board): Move[] {
    const validMoves: Move[] = [];
    const [row, col]: [number, number] = board.squareToIndex(this.position);
    const directions: [number, number][] = [
      [-2, -1], // Up (Left)
      [-2, 1], // Up (Right)
      [2, -1], // Down (Left)
      [2, 1], // Down (Right)
      [-1, -2], // Left (Up)
      [1, -2], // Left (Down)
      [-1, 2], // Right (Up)
      [1, 2], // Right (Down)
    ];

    for (const [rowOffset, colOffset] of directions) {
      const index: [number, number] = [row + rowOffset, col + colOffset];

      if (board.isValidIndex(index) && !this.isFriendlyPiece(board, index)) {
        const move: Move = {
          square: board.indexToSquare(index),
          piece: "knight",
          color: this.color,
          isCapture: this.isCapture(board, index),
          isCheck: this.isCheck(board, index),
        };

        validMoves.push(move);
      }
    }

    return this.filterSelfCheck(
      board,
      this.getPosition(),
      validMoves,
      this.getColor()
    );
  }

  isFriendlyPiece(board: Board, position: [number, number]): boolean {
    const piece: BoardSquare | null = board.getSquare(
      board.indexToSquare(position)
    );

    if (piece !== null && piece.getColor() === this.color) {
      return true;
    }

    return false;
  }

  isCheck(board: Board, position: [number, number]): boolean {
    const [row, col] = position;
    const directions: [number, number][] = [
      [-2, -1],
      [-2, 1],
      [2, -1],
      [2, 1],
      [-1, -2],
      [1, -2],
      [-1, 2],
      [1, 2],
    ];

    return directions.some(([rowOffset, colOffset]) => {
      const index: [number, number] = [row + rowOffset, col + colOffset];
      if (!board.isValidIndex(index)) return false;

      const piece = board.getSquare(board.indexToSquare(index));
      return piece instanceof King && piece.getColor() !== this.color;
    });
  }
}
