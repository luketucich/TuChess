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
import { HistoryMove } from "./Moves/HistoryMove";

// Other imports
import { Player } from "./Player";

// Generic type for board squares & moves
export type BoardSquare = null | Pawn | Knight | Bishop | Rook | Queen | King;
export type BoardMove = Move | PawnMove | KingMove;

export class Board {
  private board: BoardSquare[][];
  private history: HistoryMove[];
  private whiteKingPosition: string;
  private blackKingPosition: string;

  constructor() {
    this.board = this.initializeBoard();
    this.history = [];
    this.whiteKingPosition = "e1";
    this.blackKingPosition = "e8";
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

  setKingPosition(color: "white" | "black", position: string): void {
    if (color === "white") {
      this.whiteKingPosition = position;
    } else {
      this.blackKingPosition = position;
    }
  }

  getKingPosition(color: "white" | "black"): string {
    return color === "white" ? this.whiteKingPosition : this.blackKingPosition;
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

    // Get king positions and check if they're under attack
    const whiteKingPosition = this.getKingPosition("white");
    const blackKingPosition = this.getKingPosition("black");
    const isWhiteKingAttacked = this.isSquareAttacked(
      whiteKingPosition,
      "white"
    );
    const isBlackKingAttacked = this.isSquareAttacked(
      blackKingPosition,
      "black"
    );

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
        } else if (
          square.getName() === "king" &&
          square.getColor() === "white" &&
          isWhiteKingAttacked
        ) {
          // King in check (white) - display in red
          return `\x1b[31m${pieceSymbols[square.constructor.name]}\x1b[0m`;
        } else if (
          square.getName() === "king" &&
          square.getColor() === "black" &&
          isBlackKingAttacked
        ) {
          // King in check (black) - display in red
          return `\x1b[31m${
            pieceSymbols[square.constructor.name]
          }\x1b[0m`.toLowerCase();
        } else if (square.getColor() === "black") {
          // Regular black piece
          return `\x1b[34m${
            pieceSymbols[square.constructor.name]
          }\x1b[0m`.toLowerCase();
        } else {
          // Regular white piece
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

    if (piece instanceof King) {
      this.setKingPosition(piece.getColor(), square);
    }
  }

  setHistory(move: HistoryMove): void {
    this.history.push(move);
  }

  getHistory(): HistoryMove[] {
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

    // Handle king move
    if (move.piece === "king") {
      if (move.color === "white") {
        this.setKingPosition("white", to);
      }
      if (move.color === "black") {
        this.setKingPosition("black", to);
      }
    }

    // Add move to history
    const fromSquare = this.cloneSquare(this.getSquare(from));
    const toSquare = this.cloneSquare(this.getSquare(to));
    this.setHistory(new HistoryMove(fromSquare, toSquare, move));

    // Move piece to new square
    this.setSquare(from, null);
    this.setSquare(to, piece);
    piece.move(to);
  }

  moveClonedPiece(
    from: string,
    to: string,
    player: Player,
    move: BoardMove
  ): void {
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

    // Handle king move
    if (move.piece === "king") {
      if (move.color === "white") {
        this.setKingPosition("white", to);
      }
      if (move.color === "black") {
        this.setKingPosition("black", to);
      }
    }

    // Add move to history (if needed for the clone)
    const fromSquare = this.cloneSquare(this.getSquare(from));
    const toSquare = this.cloneSquare(this.getSquare(to));
    this.setHistory(new HistoryMove(fromSquare, toSquare, move));

    // Move piece to new square
    this.setSquare(from, null);
    this.setSquare(to, piece);
    piece.move(to);
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

  private cloneSquare(square: BoardSquare): BoardSquare {
    if (square === null) return null;

    const color = square.getColor(),
      position = square.getPosition(),
      name = square.getName();

    switch (name) {
      case "pawn":
        return new Pawn(color, position, (square as Pawn).getHasMoved());
      case "knight":
        return new Knight(color, position);
      case "bishop":
        return new Bishop(color, position);
      case "rook":
        return new Rook(color, position, (square as Rook).getHasMoved());
      case "queen":
        return new Queen(color, position);
      case "king":
        return new King(color, position, (square as King).getHasMoved());
      default:
        throw new Error("Invalid square");
    }
  }

  private cloneBoardMove(move: BoardMove): BoardMove {
    const baseMove: Move = {
      square: move.square,
      piece: move.piece,
      color: move.color,
      isCapture: move.isCapture,
      isCheck: move.isCheck,
    };

    // Check if it's a PawnMove
    if ("isPromotion" in move) {
      const pawnMove = move as PawnMove;
      return {
        ...baseMove,
        isPromotion: pawnMove.isPromotion,
        isDoubleMove: pawnMove.isDoubleMove,
        isEnPassant: pawnMove.isEnPassant,
        promotionPiece: pawnMove.promotionPiece,
      };
    }

    // Check if it's a KingMove
    if ("isCastle" in move) {
      const kingMove = move as KingMove;
      return {
        ...baseMove,
        isCastle: kingMove.isCastle,
      };
    }

    // Return basic Move if not specialized
    return baseMove;
  }

  cloneBoard(): Board {
    const boardClone = new Board();
    boardClone.board = this.board.map((row) =>
      row.map((square) => this.cloneSquare(square))
    );

    boardClone.history = this.history.map(
      (move) =>
        new HistoryMove(
          this.cloneSquare(move.getFrom()),
          this.cloneSquare(move.getTo()),
          this.cloneBoardMove(move.getMove())
        )
    );

    boardClone.whiteKingPosition = this.whiteKingPosition;
    boardClone.blackKingPosition = this.blackKingPosition;

    return boardClone;
  }

  undoMove(): void {
    if (this.history.length === 0) {
      throw new Error("No moves to undo");
    }

    const lastMove = this.history.pop() as HistoryMove;
    const fromSquare: BoardSquare = lastMove.getFrom();
    const toSquare: BoardSquare = lastMove.getTo();
    const move = lastMove.getMove();

    // Set the origin square back to its original state
    this.setSquare(fromSquare!.getPosition(), fromSquare);

    // Set the destination square back to its original state
    if (toSquare === null) {
      this.setSquare(move.square, null); // Empty square
    } else {
      this.setSquare(move.square, toSquare); // Restore captured piece
    }

    // Reset rook position if castling
    if ("isCastle" in move && move.isCastle) {
      let originalRookSquare: string;
      let newRookSquare: string;

      switch (move.square) {
        case "g1":
          originalRookSquare = "h1";
          newRookSquare = "f1";
          break;
        case "c1":
          originalRookSquare = "a1";
          newRookSquare = "d1";
          break;
        case "g8":
          originalRookSquare = "h8";
          newRookSquare = "f8";
          break;
        case "c8":
          originalRookSquare = "a8";
          newRookSquare = "d8";
          break;
        default:
          throw new Error("Invalid castling move");
      }

      // Restore rook position
      const originalRook = new Rook(move.color, originalRookSquare, false);
      this.setSquare(originalRookSquare, originalRook);
      this.setSquare(newRookSquare, null);
    }

    // Reset captured pawn if en passant
    if ("isEnPassant" in move && move.isEnPassant) {
      const [row, col] = this.squareToIndex(move.square);
      const isWhite = move.color === "white";
      const capturedPawnColor = isWhite ? "black" : "white";
      const rowOffset = isWhite ? -1 : 1;
      const capturedPawn = new Pawn(
        capturedPawnColor,
        this.indexToSquare([row - rowOffset, col]),
        true
      );

      this.setSquare(this.indexToSquare([row - rowOffset, col]), capturedPawn);
    }
  }

  isCheckmateOrStalemate(color: "white" | "black"): string {
    const isWhite = color === "white";
    const isKingAttacked = this.isSquareAttacked(
      isWhite ? this.whiteKingPosition : this.blackKingPosition,
      isWhite ? "white" : "black"
    );

    const boardMoves = this.board
      .map((row) =>
        row.filter((square) => square !== null && square.getColor() === color)
      )
      .flat()
      .map((square) => square!.getMoves(this))
      .flat();

    if (boardMoves.length === 0) {
      return isKingAttacked ? "checkmate" : "stalemate";
    }

    return "none";
  }

  clear(): void {
    this.board.forEach((row) => row.fill(null));
    this.history = [];
  }

  simplifyMove(move: BoardMove): object {
    const moveObject = {
      square: move.square,
      piece: move.piece,
      color: move.color,
      isCapture: move.isCapture,
      isCheck: move.isCheck,
      isDoubleMove: "isDoubleMove" in move ? move.isDoubleMove : undefined,
      isPromotion: "isPromotion" in move ? move.isPromotion : undefined,
      isEnPassant: "isEnPassant" in move ? move.isEnPassant : undefined,
      promotionPiece:
        "promotionPiece" in move ? move.promotionPiece : undefined,
      isCastle: "isCastle" in move ? move.isCastle : undefined,
    };

    return moveObject;
  }

  simplifySquare(square: BoardSquare): object | null {
    if (square === null) return null;

    return {
      type: square.getName(),
      color: square.getColor(),
      position: square.getPosition(),
      hasMoved: "getHasMoved" in square ? square.getHasMoved() : undefined,
    };
  }

  serializeBoard(): string {
    const serializedBoard = this.board.map((row) =>
      row.map((square) => {
        return this.simplifySquare(square);
      })
    );

    const serializedHistory = this.history.map((move) => ({
      from: this.simplifySquare(move.getFrom()),
      to: this.simplifySquare(move.getTo()),
      move: this.simplifyMove(move.getMove()),
    }));

    return JSON.stringify({
      board: serializedBoard,
      whiteKingPosition: this.whiteKingPosition,
      blackKingPosition: this.blackKingPosition,
      history: serializedHistory,
    });
  }

  deserializeBoard(serializedBoard: string): void {
    const parsedBoard = JSON.parse(serializedBoard);

    // Clear the current board
    this.clear();

    // Rebuild the board with the deserialized pieces
    this.board = parsedBoard.board.map((row: any[]) =>
      row.map((square: any) => {
        if (square === null) return null;

        switch (square.type) {
          case "pawn":
            return new Pawn(square.color, square.position, square.hasMoved);
          case "knight":
            return new Knight(square.color, square.position);
          case "bishop":
            return new Bishop(square.color, square.position);
          case "rook":
            return new Rook(square.color, square.position, square.hasMoved);
          case "queen":
            return new Queen(square.color, square.position);
          case "king":
            return new King(square.color, square.position, square.hasMoved);
          default:
            throw new Error("Invalid square type");
        }
      })
    );

    // Set king positions
    this.whiteKingPosition = parsedBoard.whiteKingPosition;
    this.blackKingPosition = parsedBoard.blackKingPosition;

    // Recreate the history
    this.history = parsedBoard.history.map((historyItem: any) => {
      // Recreate 'from' piece
      const fromSquare = historyItem.from
        ? (() => {
            const from = historyItem.from;
            switch (from.type) {
              case "pawn":
                return new Pawn(from.color, from.position, from.hasMoved);
              case "knight":
                return new Knight(from.color, from.position);
              case "bishop":
                return new Bishop(from.color, from.position);
              case "rook":
                return new Rook(from.color, from.position, from.hasMoved);
              case "queen":
                return new Queen(from.color, from.position);
              case "king":
                return new King(from.color, from.position, from.hasMoved);
              default:
                throw new Error("Invalid piece type");
            }
          })()
        : null;

      // Recreate 'to' piece
      const toSquare = historyItem.to
        ? (() => {
            const to = historyItem.to;
            switch (to.type) {
              case "pawn":
                return new Pawn(to.color, to.position, to.hasMoved);
              case "knight":
                return new Knight(to.color, to.position);
              case "bishop":
                return new Bishop(to.color, to.position);
              case "rook":
                return new Rook(to.color, to.position, to.hasMoved);
              case "queen":
                return new Queen(to.color, to.position);
              case "king":
                return new King(to.color, to.position, to.hasMoved);
              default:
                throw new Error("Invalid piece type");
            }
          })()
        : null;

      // Recreate move
      const moveData = historyItem.move;
      let move: BoardMove;

      if (
        moveData.isPromotion !== undefined ||
        moveData.isDoubleMove !== undefined ||
        moveData.isEnPassant !== undefined
      ) {
        // This is a PawnMove
        move = {
          square: moveData.square,
          piece: moveData.piece,
          color: moveData.color,
          isCapture: moveData.isCapture,
          isCheck: moveData.isCheck,
          isPromotion: moveData.isPromotion,
          isDoubleMove: moveData.isDoubleMove,
          isEnPassant: moveData.isEnPassant,
          promotionPiece: moveData.promotionPiece,
        };
      } else if (moveData.isCastle !== undefined) {
        // This is a KingMove
        move = {
          square: moveData.square,
          piece: moveData.piece,
          color: moveData.color,
          isCapture: moveData.isCapture,
          isCheck: moveData.isCheck,
          isCastle: moveData.isCastle,
        };
      } else {
        // This is a basic Move
        move = {
          square: moveData.square,
          piece: moveData.piece,
          color: moveData.color,
          isCapture: moveData.isCapture,
          isCheck: moveData.isCheck,
        };
      }

      return new HistoryMove(fromSquare, toSquare, move);
    });
  }
}
