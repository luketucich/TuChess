import { Piece } from "./Piece.ts";
import { Board, BoardSquare } from "../Board.ts";
import { Move } from "../Moves/Move.ts";
import { King } from "./King.ts";

export class Knight extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3); // Initialize Knight with color, position, and value
  }

  move(position: string): void {
    this.position = position; // Update the Knight's position
  }

  getMoves(board: Board): Move[] {
    const validMoves: Move[] = []; // Array to store valid moves
    const [row, col]: [number, number] = board.squareToIndex(this.position); // Get current position as indices
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

    // Check all possible moves
    for (const [rowOffset, colOffset] of directions) {
      const index: [number, number] = [row + rowOffset, col + colOffset];

      // Check if the move is within the board and not blocked by a friendly piece
      if (board.isValidIndex(index) && !this.isFriendlyPiece(board, index)) {
        const move: Move = {
          square: board.indexToSquare(index), // Convert index to board square
          piece: "knight",
          color: this.color,
          isCapture: this.isCapture(board, index), // Check if the move captures an opponent's piece
          isCheck: this.isCheck(board, index), // Check if the move puts the opponent's king in check
        };

        validMoves.push(move); // Add the move to the list of valid moves
      }
    }

    return validMoves; // Return all valid moves
  }

  isFriendlyPiece(board: Board, position: [number, number]): boolean {
    const piece: BoardSquare | null = board.getSquare(
      board.indexToSquare(position)
    );

    // Check if the piece at the position is friendly
    if (piece !== null && piece.getColor() === this.color) {
      return true;
    }

    return false;
  }

  isCapture(board: Board, position: [number, number]): boolean {
    const piece: BoardSquare | null = board.getSquare(
      board.indexToSquare(position)
    );

    // Check if the piece at the position is an opponent's piece
    if (piece !== null && piece.getColor() !== this.color) {
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

    // Check if any move puts the opponent's king in check
    return directions.some(([rowOffset, colOffset]) => {
      const index: [number, number] = [row + rowOffset, col + colOffset];
      if (!board.isValidIndex(index)) return false;

      const piece = board.getSquare(board.indexToSquare(index));
      return piece instanceof King && piece.getColor() !== this.color;
    });
  }
}
