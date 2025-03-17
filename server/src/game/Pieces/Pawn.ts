import { Piece } from "./Piece";
import { PawnMove } from "../Moves/PawnMove";
import { King } from "./King";
import { BoardMove, BoardSquare } from "../Board";
import { Board } from "../Board";

export class Pawn extends Piece {
  private hasMoved: boolean;

  constructor(
    color: "white" | "black",
    position: string,
    hasMoved: boolean = false
  ) {
    super(color, position, 1, "pawn");
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
    const validMoves: PawnMove[] = [];
    const currBoard: BoardSquare[][] = board.getBoard();
    const [row, col]: [number, number] = board.squareToIndex(this.position);
    const isWhite: boolean = this.color === "white";

    // White moves up, black moves down
    const rowOffset: number = isWhite ? -1 : 1;

    // Check forward move (1 square)
    if (
      board.isValidIndex([row + rowOffset, col]) &&
      currBoard[row + rowOffset][col] === null
    ) {
      const move: PawnMove = {
        square: board.indexToSquare([row + rowOffset, col]),
        piece: "pawn",
        color: this.color,
        isCapture: false,
        isCheck: this.isCheck(board, [row + rowOffset, col], isWhite),
        isPromotion: this.isPromotion([row + rowOffset, col], isWhite),
      };

      validMoves.push(move);

      // Check double move (2 squares)
      if (
        board.isValidIndex([row + rowOffset * 2, col]) &&
        row === (isWhite ? 6 : 1) &&
        currBoard[row + rowOffset * 2][col] === null &&
        !this.hasMoved
      ) {
        const move: PawnMove = {
          square: board.indexToSquare([row + rowOffset * 2, col]),
          piece: "pawn",
          color: this.color,
          isCapture: false,
          isDoubleMove: true,
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
        piece: "pawn",
        color: this.color,
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
        piece: "pawn",
        color: this.color,
        isCapture: true,
        isCheck: this.isCheck(board, [row + rowOffset, col + 1], isWhite),
        isPromotion: this.isPromotion([row + rowOffset, col + 1], isWhite),
      };

      validMoves.push(move);
    }

    // Check en passant (special capture rule)
    if (this.canEnPassant(board)) {
      const [lastMoveRow, lastMoveCol]: [number, number] = board.squareToIndex(
        board.getHistory()[board.getHistory().length - 1].getMove().square
      );

      const move: PawnMove = {
        square: board.indexToSquare([lastMoveRow + rowOffset, lastMoveCol]),
        piece: "pawn",
        color: this.color,
        isCapture: true,
        isEnPassant: true,
        isCheck: this.isCheck(board, [row + rowOffset, lastMoveCol], isWhite),
        isPromotion: false,
      };

      validMoves.push(move);
    }

    return this.filterSelfCheck(
      board,
      this.position,
      validMoves,
      this.color
    ) as PawnMove[];
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
        const square = board.getBoard()[r][c];
        if (square instanceof King && square.getColor() !== this.color) {
          return true;
        }
      }
    }

    return false;
  }

  private isPromotion(move: [number, number], isWhite: boolean) {
    return isWhite ? move[0] === 0 : move[0] === 7;
  }

  private canEnPassant(board: Board) {
    const history = board.getHistory();
    if (history.length === 0) return false;

    // Check if last move was a pawn move and an enemy move
    const lastMove: BoardMove = history[history.length - 1].getMove();
    if (lastMove.piece !== "pawn") return false;
    if (lastMove.color === this.color) return false;

    const [lastMoveRow, lastMoveCol]: [number, number] = board.squareToIndex(
      lastMove.square
    );
    const [currPosRow, currPosCol]: [number, number] = board.squareToIndex(
      this.position
    );

    // Check if last move aligns with en passant criteria
    if (
      "isDoubleMove" in lastMove &&
      lastMove.isDoubleMove && // Check if last move was a double move
      lastMoveRow === currPosRow && // Check if last move was on the same row as current pawn
      (lastMoveCol === currPosCol - 1 || lastMoveCol === currPosCol + 1) // Check if last move was adjacent to current pawn
    ) {
      return true;
    }

    return false;
  }
}
