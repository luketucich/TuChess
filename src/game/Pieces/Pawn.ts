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
    const rowOffset: number = isWhite ? -1 : 1;

    // Check forward move (1 square)
    if (
      board.isValidIndex([row + rowOffset, col]) &&
      currBoard[row + rowOffset][col] === null
    ) {
      const move: PawnMove = {
        square: board.indexToSquare([row + rowOffset, col]),
        isCapture: false,
        isCheck: this.isCheck(board, [row + rowOffset, col], isWhite),
        isPromotion: this.isPromotion([row + rowOffset, col], isWhite),
      };

      validMoves.push(move);

      // Check double move (2 squares)
      if (
        board.isValidIndex([row + rowOffset * 2, col]) &&
        currBoard[row + rowOffset * 2][col] === null &&
        !this.hasMoved
      ) {
        const move: PawnMove = {
          square: board.indexToSquare([row + rowOffset * 2, col]),
          isCapture: false,
          isCheck: this.isCheck(board, [row + rowOffset * 2, col], isWhite),
          isPromotion: false,
        };

        validMoves.push(move);
      }
    }

    // Check diagonal captures (left and right)
    // Left capture
    if (this.isCapture(board, [row + rowOffset, col - 1])) {
      const move: PawnMove = {
        square: board.indexToSquare([row + rowOffset, col - 1]),
        isCapture: true,
        isCheck: this.isCheck(board, [row + rowOffset, col - 1], isWhite),
        isPromotion: this.isPromotion([row + rowOffset, col - 1], isWhite),
      };

      validMoves.push(move);
    }

    // Right capture
    if (this.isCapture(board, [row + rowOffset, col + 1])) {
      const move: PawnMove = {
        square: board.indexToSquare([row + rowOffset, col + 1]),
        isCapture: true,
        isCheck: this.isCheck(board, [row + rowOffset, col + 1], isWhite),
        isPromotion: this.isPromotion([row + rowOffset, col + 1], isWhite),
      };

      validMoves.push(move);
    }

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
        const square = board.getBoard()[r][c]; // Get contents of square
        if (square instanceof King && square.getColor() !== this.color) {
          return true;
        }
      }
    }

    return false;
  }

  private isCapture(board: Board, move: [number, number]): boolean {
    const [row, col]: [number, number] = move;

    if (!board.isValidIndex([row, col])) return false; // Out-of-bounds check

    const square = board.getBoard()[row][col];

    return (
      square !== null &&
      square.getColor() !== this.color &&
      !(square instanceof King)
    );
  }

  private isPromotion(move: [number, number], isWhite: boolean) {
    return isWhite ? move[0] === 0 : move[0] === 7;
  }
}
