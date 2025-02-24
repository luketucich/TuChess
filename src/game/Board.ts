import { Bishop } from "./Pieces/Bishop";
import { Knight } from "./Pieces/Knight";
import { Pawn } from "./Pieces/Pawn";
import { Rook } from "./Pieces/Rook";
import { Queen } from "./Pieces/Queen";
import { King } from "./Pieces/King";
import { Move } from "./Moves/Move";
import { Player } from "./Player";
import { Piece } from "./Pieces/Piece";
import { PawnMove } from "./Moves/PawnMove";

// Define generic type for board squares
export type BoardSquare = null | Pawn | Knight | Bishop | Rook | Queen | King;
export type BoardMove = Move | PawnMove;

export class Board {
  private board: BoardSquare[][];
  private history: BoardMove[];

  constructor() {
    this.board = this.initializeBoard();
    this.history = [];
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

  isValidSquare(square: string): boolean {
    if (square.length !== 2) return false;

    const [file, rank]: [string, string] = [square[0], square[1]];

    if (file < "a" || file > "h") return false;
    if (rank < "1" || rank > "8") return false;

    return true;
  }

  isValidIndex(index: [number, number]): boolean {
    const [row, col]: [number, number] = index;

    if (row < 0 || row > 7) return false;
    if (col < 0 || col > 7) return false;

    return true;
  }

  getSquare(square: string): BoardSquare {
    if (!this.isValidSquare(square)) {
      throw new Error("Invalid square");
    }

    const [row, col]: [number, number] = this.squareToIndex(square);
    return this.board[row][col];
  }

  setSquare(square: string, piece: BoardSquare): void {
    if (!this.isValidSquare(square)) {
      throw new Error("Invalid square");
    }

    const [row, col]: [number, number] = this.squareToIndex(square);
    this.board[row][col] = piece;
  }

  setHistory(move: Move): void {
    this.history.push(move);
  }

  getHistory(): Move[] {
    return this.history;
  }

  movePiece(from: string, to: string, player: Player): void {
    // Check if move is valid
    if (!this.isValidSquare(from) || !this.isValidSquare(to)) {
      throw new Error("Invalid square");
    }

    if (from === to) {
      throw new Error("Cannot move piece to same square");
    }

    const piece: BoardSquare | null = this.getSquare(from);
    if (!piece) {
      throw new Error("No piece at from square");
    }

    const moves: BoardMove[] = piece.getMoves(this);

    // Loop through valid moves to find matching move
    for (const move of moves) {
      if (move.square === to) {
        // Capture piece if move is a capture
        if (move.isCapture) {
          const capturedPiece: Piece = this.getSquare(to)!;
          player.addPiece(capturedPiece);
        }

        // Move piece to new square
        this.setSquare(from, null);
        this.setSquare(to, piece);
        piece.move(to);

        // Set square beneath move to null if en passant
        if ("isEnPassant" in move && move.isEnPassant) {
          const rowOffset: number = move.color === "white" ? -1 : 1;
          const [row, col]: [number, number] = this.squareToIndex(move.square);

          this.board[row - rowOffset][col] = null;
        }

        // Add move to history
        this.setHistory(move);

        return;
      }
    }

    // If no valid move was found, throw an error
    throw new Error("Invalid move");
  }
}
