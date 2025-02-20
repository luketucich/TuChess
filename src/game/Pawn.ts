import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";
import { King } from "./King.ts";

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

  getMoves(board: Board): {
    moves: string[];
    captures: string[];
    checks: string[];
  } {
    const moves: string[] = this.getForwardMoves(board);
    const captures: string[] = this.getCaptures(board);
    const checks: string[] = moves.flatMap((move) =>
      this.getChecks(board, move)
    );

    return {
      moves: moves,
      captures: captures,
      checks: checks,
    };
  }
  private getForwardMoves(board: Board): string[] {
    const isWhite = this.color === "white";
    const [currentRow, currentCol] = board.squareToIndex(this.position);
    const moves: string[] = [];

    // One-step move
    const oneStepRow = isWhite ? currentRow - 1 : currentRow + 1;
    const oneStepSquare = board.indexToSquare([oneStepRow, currentCol]);
    if (
      board.squareIsValid(oneStepSquare) &&
      board.getSquare(oneStepSquare) === null
    ) {
      moves.push(oneStepSquare);
    }

    // Two-step move (only from starting position)
    const startingRow = isWhite ? 6 : 1;
    if (currentRow === startingRow && !this.hasMoved) {
      const twoStepRow = isWhite ? currentRow - 2 : currentRow + 2;
      const twoStepSquare = board.indexToSquare([twoStepRow, currentCol]);
      const intermediateRow = isWhite ? currentRow - 1 : currentRow + 1;
      const intermediateSquare = board.indexToSquare([
        intermediateRow,
        currentCol,
      ]);

      if (
        board.squareIsValid(twoStepSquare) &&
        board.getSquare(twoStepSquare) === null &&
        board.getSquare(intermediateSquare) === null
      ) {
        moves.push(twoStepSquare);
      }
    }

    return moves;
  }

  private getCaptures(board: Board): string[] {
    const isWhite = this.color === "white";
    const [row, col] = board.squareToIndex(this.position);
    const captures: string[] = [];
    const directions = [-1, 1];
    const rowOffset = isWhite ? -1 : 1;

    directions.forEach((colOffset) => {
      const captureSquare = board.indexToSquare([
        row + rowOffset,
        col + colOffset,
      ]);

      if (board.squareIsValid(captureSquare)) {
        const piece = board.getSquare(captureSquare);

        if (
          piece !== null &&
          piece.getColor() !== this.color &&
          piece instanceof King === false
        ) {
          captures.push(captureSquare);
        }
      }
    });

    return captures;
  }

  private getChecks(board: Board, move: string): string[] {
    const isWhite = this.color === "white";
    const [row, col] = board.squareToIndex(move);
    const checks: string[] = [];
    const directions = [-1, 1];
    const rowOffset = isWhite ? -1 : 1;

    directions.forEach((colOffset) => {
      const checkSquare = board.indexToSquare([
        row + rowOffset,
        col + colOffset,
      ]);

      if (board.squareIsValid(checkSquare)) {
        const piece = board.getSquare(checkSquare);

        if (
          piece !== null &&
          piece.getColor() !== this.color &&
          piece instanceof King === true
        ) {
          checks.push(move);
        }
      }
    });

    return checks;
  }

  move(position: string): void {
    this.position = position;
    this.hasMoved = true;
  }
}
