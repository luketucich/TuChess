// Piece imports
import { Bishop } from "./Pieces/Bishop";
import { King } from "./Pieces/King";
import { Knight } from "./Pieces/Knight";
import { Pawn } from "./Pieces/Pawn";
import { Queen } from "./Pieces/Queen";
import { Rook } from "./Pieces/Rook";

// Move imports
import { Move } from "./Moves/Move";
import { KingMove } from "./Moves/KingMove";
import { PawnMove } from "./Moves/PawnMove";

// Other imports
import { Player } from "./Player";

// Define generic type for board squares
export type BoardSquare = null | Pawn | Knight | Bishop | Rook | Queen | King;
export type BoardMove = Move | PawnMove | KingMove;

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

  displayBoard(player: Player): void {
    const pieceSymbols: { [key: string]: string } = {
      Pawn: "P",
      Knight: "N",
      Bishop: "B",
      Rook: "R",
      Queen: "Q",
      King: "K",
    };

    // Display board based off player's perspective
    const board =
      player.getColor() === "black"
        ? this.board.map((row) => [...row].reverse()).reverse()
        : this.board;

    for (const row of board) {
      const displayRow: string[] = row.map((square) => {
        // If square is empty, display a hyphen
        if (square === null) {
          return "-";

          // If square is occupied by black piece, display piece symbol in red
        } else if (square.getColor() === "black") {
          return `\x1b[34m${
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

  getIndex(index: [number, number]) {
    if (!this.isValidIndex(index)) {
      throw new Error("Invalid index");
    }
    const [row, col]: [number, number] = [index[0], index[1]];
    return this.board[row][col];
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
    // Validate basic move conditions
    if (!player.getIsTurn()) {
      throw new Error("Not your turn");
    }

    if (!this.isValidSquare(from) || !this.isValidSquare(to) || from === to) {
      throw new Error("Invalid move");
    }

    const piece: BoardSquare = this.getSquare(from);
    if (!piece || piece.getColor() !== player.getColor()) {
      throw new Error("Invalid piece selection");
    }

    // Find the matching move in valid moves
    const moves: BoardMove[] = piece.getMoves(this);
    const move = moves.find((move) => move.square === to);

    if (!move) {
      throw new Error("Invalid move");
    }

    // Handle captures
    if (move.isCapture) {
      // Handle en passant
      if ("isEnPassant" in move && move.isEnPassant) {
        const rowOffset: number = move.color === "white" ? -1 : 1;
        const [row, col]: [number, number] = this.squareToIndex(move.square);
        const capturedPawn: BoardSquare = this.board[row - rowOffset][col];

        if (capturedPawn) {
          player.addPiece(capturedPawn);
          this.board[row - rowOffset][col] = null;
        }
      }
      // Handle regular capture
      else {
        const capturedPiece = this.getSquare(to);
        if (capturedPiece) {
          player.addPiece(capturedPiece);
        }
      }
    }

    // Handle castling
    if ("isCastle" in move && move.isCastle) {
      this.handleCastling(move.square);
    }

    // Move piece to new square
    this.setSquare(from, null);
    this.setSquare(to, piece);
    piece.move(to);

    // Add move to history
    this.setHistory(move);
  }

  private handleCastling(square: string): void {
    const castlingMoves = {
      g1: { rookFrom: "h1", rookTo: "f1" },
      c1: { rookFrom: "a1", rookTo: "d1" },
      g8: { rookFrom: "h8", rookTo: "f8" },
      c8: { rookFrom: "a8", rookTo: "d8" },
    };

    const castleMove = castlingMoves[square as keyof typeof castlingMoves];
    if (castleMove) {
      const rook = this.getSquare(castleMove.rookFrom) as Rook;
      this.setSquare(castleMove.rookTo, rook);
      this.setSquare(castleMove.rookFrom, null);
      rook.move(castleMove.rookTo);
    }
  }

  isSquareAttacked(position: string, attackedKingColor: string): boolean {
    if (!this.isValidSquare(position)) {
      throw new Error("Invalid position");
    }

    const [targetRow, targetCol] = this.squareToIndex(position);

    // Define all attack patterns
    const pawnOffsets =
      attackedKingColor === "black"
        ? [
            [1, -1],
            [1, 1],
          ]
        : [
            [-1, -1],
            [-1, 1],
          ];

    const kingOffsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    const knightOffsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    const diagonalDirections = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    const straightDirections = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    // Check for pawn attacks
    for (const [rowOffset, colOffset] of pawnOffsets) {
      const checkRow = targetRow + rowOffset;
      const checkCol = targetCol + colOffset;

      if (this.isValidIndex([checkRow, checkCol])) {
        const piece = this.board[checkRow][checkCol];
        if (
          piece &&
          piece.getName() === "pawn" &&
          piece.getColor() !== attackedKingColor
        ) {
          return true;
        }
      }
    }

    // Check for king attacks
    for (const [rowOffset, colOffset] of kingOffsets) {
      const checkRow = targetRow + rowOffset;
      const checkCol = targetCol + colOffset;

      if (this.isValidIndex([checkRow, checkCol])) {
        const piece = this.board[checkRow][checkCol];
        if (
          piece &&
          piece.getName() === "king" &&
          piece.getColor() !== attackedKingColor
        ) {
          return true;
        }
      }
    }

    // Check for knight attacks
    for (const [rowOffset, colOffset] of knightOffsets) {
      const checkRow = targetRow + rowOffset;
      const checkCol = targetCol + colOffset;

      if (this.isValidIndex([checkRow, checkCol])) {
        const piece = this.board[checkRow][checkCol];
        if (
          piece &&
          piece.getName() === "knight" &&
          piece.getColor() !== attackedKingColor
        ) {
          return true;
        }
      }
    }

    // Check diagonal attacks (bishop and queen)
    for (const [rowDir, colDir] of diagonalDirections) {
      let checkRow = targetRow + rowDir;
      let checkCol = targetCol + colDir;

      while (this.isValidIndex([checkRow, checkCol])) {
        const piece = this.board[checkRow][checkCol];
        if (piece) {
          if (
            (piece.getName() === "bishop" || piece.getName() === "queen") &&
            piece.getColor() !== attackedKingColor
          ) {
            return true;
          }
          break; // Stop if we hit any piece
        }
        checkRow += rowDir;
        checkCol += colDir;
      }
    }

    // Check straight attacks (rook and queen)
    for (const [rowDir, colDir] of straightDirections) {
      let checkRow = targetRow + rowDir;
      let checkCol = targetCol + colDir;

      while (this.isValidIndex([checkRow, checkCol])) {
        const piece = this.board[checkRow][checkCol];
        if (piece) {
          if (
            (piece.getName() === "rook" || piece.getName() === "queen") &&
            piece.getColor() !== attackedKingColor
          ) {
            return true;
          }
          break; // Stop if we hit any piece
        }
        checkRow += rowDir;
        checkCol += colDir;
      }
    }

    return false;
  }
}
