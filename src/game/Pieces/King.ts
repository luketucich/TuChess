import { Piece } from "./Piece.ts";
import { Board } from "../Board.ts";
import { KingMove } from "../Moves/KingMove.ts";
import { Rook } from "./Rook.ts";

export class King extends Piece {
  private hasMoved: boolean;

  constructor(
    color: "white" | "black",
    position: string,
    hasMoved: boolean = false
  ) {
    super(color, position, Infinity, "king");
    this.hasMoved = hasMoved;
  }

  getHasMoved(): boolean {
    return this.hasMoved;
  }

  move(position: string): void {
    this.position = position;
    this.hasMoved = true;
  }

  getMoves(board: Board): KingMove[] {
    const validMoves: KingMove[] = [];
    const [row, col]: [number, number] = board.squareToIndex(this.position);
    const directions: [number, number][] = [
      [-1, -1], // Top (left)
      [-1, 0], // Top
      [-1, 1], // Top (right)
      [0, -1], // Left
      [0, 1], // Right
      [1, -1], // Bottom (left)
      [1, 0], // Bottom
      [1, 1], // Bottom (right)
    ];

    for (const [rowOffset, colOffset] of directions) {
      const index: [number, number] = [row + rowOffset, col + colOffset];
      const square = board.indexToSquare(index);

      if (
        board.isValidIndex(index) &&
        !board.isSquareAttacked(square, this.color)
      ) {
        const move: KingMove = {
          square: square,
          piece: "king",
          color: this.color,
          isCapture: this.isCapture(board, index),
          isCheck: false,
          isCastle: false,
        };

        validMoves.push(move);
      }
    }

    // Get castling moves
    if (this.canShortCastle(board)) {
      validMoves.push({
        square: this.color === "white" ? "g1" : "g8",
        piece: "king",
        color: this.color,
        isCapture: false,
        isCheck: false,
        isCastle: true,
      });
    }

    if (this.canLongCastle(board)) {
      validMoves.push({
        square: this.color === "white" ? "c1" : "c8",
        piece: "king",
        color: this.color,
        isCapture: false,
        isCheck: false,
        isCastle: true,
      });
    }

    return validMoves;
  }

  canShortCastle(board: Board): boolean {
    if (this.hasMoved) {
      return false;
    }

    const rookSquare = this.color === "white" ? "h1" : "h8",
      rook = board.getSquare(rookSquare);

    if (!(rook instanceof Rook) || rook.getHasMoved()) {
      return false;
    }

    const travelSquares = this.color === "white" ? ["f1", "g1"] : ["f8", "g8"];

    return travelSquares.every(
      (square) =>
        board.getSquare(square) === null &&
        !board.isSquareAttacked(square, this.color)
    );
  }

  canLongCastle(board: Board): boolean {
    if (this.hasMoved) {
      return false;
    }

    const rookSquare = this.color === "white" ? "a1" : "a8",
      rook = board.getSquare(rookSquare);

    if (!(rook instanceof Rook) || rook.getHasMoved()) {
      return false;
    }

    const travelSquares =
      this.color === "white" ? ["b1", "c1", "d1"] : ["b8", "c8", "d8"];

    return travelSquares.every(
      (square) =>
        board.getSquare(square) === null &&
        !board.isSquareAttacked(square, this.color)
    );
  }
}
