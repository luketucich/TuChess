import { Piece } from "./Piece.ts";
import { PawnMove } from "../Moves/PawnMove.ts";
import { King } from "./King.ts";
import { BoardSquare } from "../Board.ts";
import { Board } from "../Board.ts";

export class Pawn extends Piece {
  private hasMoved: boolean;

  constructor(
    color: "white" | "black",
    position: string,
    hasMoved: boolean = false
  ) {
    super(color, position, 1);
    this.hasMoved = hasMoved;
  }

  getHasMoved(): boolean {
    return this.hasMoved;
  }

  move(position: string): void {
    this.position = position;
    this.hasMoved = true;
  }

  getMoves(board: Board): PawnMove[] {
    // Initialize array to store valid moves & get current board state
    const validMoves: PawnMove[] = [];
    const currBoard: BoardSquare[][] = board.getBoard();
    const [row, col]: [number, number] = board.squareToIndex(this.position);
    const isWhite: boolean = this.color === "white";

    // Determine move direction based on color (white moves up, black moves down)
    const up: number = isWhite ? -1 : 1;

    // Check forward move (1 square)
    if (currBoard[row + up][col] === null) {
      // See if check
      // Create PawnMove object and add to validMoves array

      // Check double move (2 squares)
      if (currBoard[row + up * 2][col] === null && !this.hasMoved) {
        // See if check
        // Create PawnMove object and add to validMoves array
      }
    }

    // Check diagonal captures (left and right)

    // Check en passant (special capture rule)

    // Check if the pawn reaches the last rank (promotion)

    return validMoves;
  }

  private isCheck(
    board: Board,
    move: [number, number],
    isWhite: boolean
  ): boolean {
    const [row, col]: [number, number] = move;
    const rowOffset: number = isWhite ? -1 : 1;

    // Check both diagonal attack positions
    const diagonals: [number, number][] = [
      [row + rowOffset, col - 1],
      [row + rowOffset, col + 1],
    ];

    for (const [r, c] of diagonals) {
      if (board.isValidIndex([r, c])) {
        const square = board.getSquare(board.indexToSquare([r, c])); // Get contents of square
        if (square instanceof King && square.getColor() !== this.color) {
          return true;
        }
      }
    }

    return false;
  }
}
