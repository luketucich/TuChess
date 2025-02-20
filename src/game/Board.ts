import { Bishop } from "./Bishop";
import { Knight } from "./Knight";
import { Pawn } from "./Pawn";
import { Rook } from "./Rook";
import { Queen } from "./Queen";
import { King } from "./King";

// Define generic type for board squares
type BoardSquare = null | Pawn | Knight | Bishop | Rook | Queen | King;

export class Board {
  private board: BoardSquare[][];

  constructor() {
    this.board = this.initializeBoard();
  }

  private initializeBoard(): BoardSquare[][] {
    return [
      [
        new Rook("black", "a8"),
        new Knight("black", "b8"),
        new Bishop("black", "c8"),
        new Queen("black", "d8"),
        new King("black", "e8"),
        new Bishop("black", "f8"),
        new Knight("black", "g8"),
        new Rook("black", "h8"),
      ],
      ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"].map(
        (square) => new Pawn("black", square)
      ),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"].map(
        (square) => new Pawn("white", square)
      ),
      [
        new Rook("white", "a1"),
        new Knight("white", "b1"),
        new Bishop("white", "c1"),
        new Queen("white", "d1"),
        new King("white", "e1"),
        new Bishop("white", "f1"),
        new Knight("white", "g1"),
        new Rook("white", "h1"),
      ],
    ];
  }

  getBoard(): BoardSquare[][] {
    return this.board;
  }

  displayBoard(): void {
    const pieceSymbols: { [key: string]: string } = {
      Pawn: "P",
      Knight: "N",
      Bishop: "B",
      Rook: "R",
      Queen: "Q",
      King: "K",
    };

    for (const row of this.board) {
      const displayRow: string[] = row.map((square) => {
        // If square is empty, display a hypen
        if (square === null) {
          return "-";

          // If square is occupied by black piece, display piece symbol in red
        } else if (square.getColor() === "black") {
          return `\x1b[31m${
            pieceSymbols[square.constructor.name]
          }\x1b[0m`.toLowerCase();

          // If square is occupied by white piece, display piece symbol in white
        } else {
          return `\x1b[37m${pieceSymbols[square.constructor.name]}\x1b[0m`;
        }
      });

      console.log(displayRow.join(" "));
    }
  }

  indexToSquare(index: [number, number]): string {
    const [row, col]: [number, number] = index;

    // Convert row number to rank
    const rank: string = `${8 - row}`;

    // Convert column number to file
    const file: string = String.fromCharCode(97 + col);

    return file + rank;
  }

  squareToIndex(square: string): [number, number] {
    // Convert file to column number
    const col: number = square.charCodeAt(0) - "a".charCodeAt(0);

    // Convert rank to row number
    const row: number = 8 - Number(square[1]);

    return [row, col];
  }

  squareIsValid(square: string): boolean {
    if (square.length !== 2) return false;

    const [file, rank]: [string, string] = [square[0], square[1]];

    if (file < "a" || file > "h") return false;
    if (rank < "1" || rank > "8") return false;

    return true;
  }

  indexIsValid(index: [number, number]): boolean {
    const [row, col]: [number, number] = index;

    if (row < 0 || row > 7) return false;
    if (col < 0 || col > 7) return false;

    return true;
  }

  getSquare(square: string): BoardSquare {
    if (!this.squareIsValid(square)) {
      throw new Error("Invalid square");
    }

    const [row, col]: [number, number] = this.squareToIndex(square);
    return this.board[row][col];
  }

  setSquare(square: string, piece: BoardSquare): void {
    if (!this.squareIsValid(square)) {
      throw new Error("Invalid square");
    }

    const [row, col]: [number, number] = this.squareToIndex(square);
    this.board[row][col] = piece;
  }

  movePiece(from: string, to: string): void {
    const currPiece: BoardSquare = this.getSquare(from);

    // Check if squares are valid
    if (!this.squareIsValid(from) || !this.squareIsValid(to)) {
      throw new Error("Invalid square");
    }

    // Check if there is a piece at the from square
    if (currPiece === null) {
      throw new Error("No piece at from square");
    }

    // Check if the move is legal
    const legalMoves: string[] = currPiece.getMoves(this).moves;
    if (!legalMoves.includes(to)) {
      throw new Error("Illegal move");
    }

    // If all checks pass, move the piece
    const [fromRow, fromCol]: [number, number] = this.squareToIndex(from);
    const [toRow, toCol]: [number, number] = this.squareToIndex(to);

    // Move piece on board
    this.board[fromRow][fromCol] = null;
    this.board[toRow][toCol] = currPiece;

    // Update piece position and any other properties
    currPiece.move(to);
  }

  capturePiece(from: string, to: string): void {
    const currPiece: BoardSquare = this.getSquare(from);

    // Check if squares are valid
    if (!this.squareIsValid(from) || !this.squareIsValid(to)) {
      throw new Error("Invalid square");
    }

    // Check if there is a piece at the from square
    if (currPiece === null) {
      throw new Error("No piece at from square");
    }

    // Check if the capture is legal
    const legalCaptures: string[] = currPiece.getCaptures(this);
    if (!legalCaptures.includes(to)) {
      throw new Error("Illegal move");
    }

    // If all checks pass, capture the piece
    const [fromRow, fromCol]: [number, number] = this.squareToIndex(from);
    const [toRow, toCol]: [number, number] = this.squareToIndex(to);

    // Move piece on board
    this.board[fromRow][fromCol] = null;
    this.board[toRow][toCol] = currPiece;

    // Update piece position and any other properties
    currPiece.move(to);
  }
}
