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
    // Check if it's the player's turn
    if (player.getIsTurn() === false) {
      throw new Error("Not your turn");
    }

    // Check if move is valid
    if (!this.isValidSquare(from) || !this.isValidSquare(to)) {
      throw new Error("Invalid square");
    }

    // Check if from square is the same as to square
    if (from === to) {
      throw new Error("Cannot move piece to same square");
    }

    // Check if from square is empty
    const piece: BoardSquare = this.getSquare(from);
    if (!piece) {
      throw new Error("No piece at from square");
    }

    // Check if piece belongs to player
    if (piece.getColor() !== player.getColor()) {
      throw new Error("Cannot move opponent's piece");
    }

    const moves: BoardMove[] = piece.getMoves(this);

    // Loop through valid moves to find matching move
    for (const move of moves) {
      if (move.square === to) {
        // Capture piece if move is a capture
        if (move.isCapture) {
          const capturedPiece: Piece = this.getSquare(to)!;

          // To square is null in en passant
          if (capturedPiece !== null) {
            player.addPiece(capturedPiece);
          }
        }

        // Capture piece if move is an en passant
        if ("isEnPassant" in move && move.isEnPassant) {
          const rowOffset: number = move.color === "white" ? -1 : 1;
          const [row, col]: [number, number] = this.squareToIndex(move.square);
          const capturedPawn: BoardSquare = this.board[row - rowOffset][
            col
          ] as Pawn;
          player.addPiece(capturedPawn);
          this.board[row - rowOffset][col] = null;
        }

        // Move piece to new square
        this.setSquare(from, null);
        this.setSquare(to, piece);
        piece.move(to);

        // Add move to history
        this.setHistory(move);

        return;
      }
    }

    // If no valid move was found, throw an error
    throw new Error("Invalid move");
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
