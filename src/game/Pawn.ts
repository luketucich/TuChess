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

  move(position: string): void {
    this.position = position;
    this.hasMoved = true;
  }
}
