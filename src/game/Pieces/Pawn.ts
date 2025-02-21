import { Piece } from "./Piece.ts";
import { Move } from "../Moves/Move.ts";
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

  getMoves(board: Board): Move[] {
    const validMoves: Move[] = [];

    // Determine move direction based on color (white moves up, black moves down)

    // Check forward move (1 square) if empty

    // Check double move (2 squares) if it's the first move and both squares are empty

    // Check diagonal captures (left and right)

    // Check en passant (special capture rule)

    // Check if the pawn reaches the last rank (promotion)

    return validMoves;
  }
}
