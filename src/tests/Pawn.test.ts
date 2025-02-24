import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { King } from "../game/Pieces/King.ts";
import { Rook } from "../game/Pieces/Rook.ts";
import { Queen } from "../game/Pieces/Queen.ts";
import { Board } from "../game/Board.ts";

describe("Pawn properties", () => {
  test("should have the correct properties", () => {
    const pawn = new Pawn("white", "a2");

    // Check pawn color
    expect(pawn.getColor()).toBe("white");
    // Check pawn position
    expect(pawn.getPosition()).toBe("a2");
    // Check if pawn has moved
    expect(pawn.getHasMoved()).toBeFalsy();
    // Check pawn value
    expect(pawn.getValue()).toBe(1);

    const pawn2 = new Pawn("black", "h7", true);
    // Check pawn color
    expect(pawn2.getColor()).toBe("black");
    // Check pawn position
    expect(pawn2.getPosition()).toBe("h7");
    // Check if pawn has moved
    expect(pawn2.getHasMoved()).toBeTruthy();
    // Check pawn value
    expect(pawn2.getValue()).toBe(1);
  });
});

describe("Pawn movement at start", () => {
  test("should allow pawn to move 1 or 2 squares forward", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a2");

    // Check valid moves for white pawn at start position
    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      { square: "a3", isCapture: false, isCheck: false, isPromotion: false },
      { square: "a4", isCapture: false, isCheck: false, isPromotion: false },
    ]);

    const pawn2 = new Pawn("black", "h7");
    // Check valid moves for black pawn at start position
    const validMoves2 = pawn2.getMoves(board);
    expect(validMoves2).toEqual([
      { square: "h6", isCapture: false, isCheck: false, isPromotion: false },
      { square: "h5", isCapture: false, isCheck: false, isPromotion: false },
    ]);
  });
});

describe("Pawn movement after start", () => {
  test("should allow pawn to move 1 square forward", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a3", true);

    // Check valid moves for white pawn after moving 1 square
    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      { square: "a4", isCapture: false, isCheck: false, isPromotion: false },
    ]);

    const pawn2 = new Pawn("black", "h6", true);
    // Check valid moves for black pawn after moving 1 square
    const validMoves2 = pawn2.getMoves(board);
    expect(validMoves2).toEqual([
      { square: "h5", isCapture: false, isCheck: false, isPromotion: false },
    ]);
  });
});

describe("Pawn capture", () => {
  test("should allow pawn to capture diagonally", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a3", true);

    // Place black pawn at b4
    board.setSquare("b4", new Pawn("black", "b4"));

    // Check valid moves for white pawn to capture black pawn
    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      { square: "a4", isCapture: false, isCheck: false, isPromotion: false },
      { square: "b4", isCapture: true, isCheck: false, isPromotion: false },
    ]);

    const pawn2 = new Pawn("black", "h6", true);

    // Place white pawn at g5
    board.setSquare("g5", new Pawn("white", "g5"));

    // Check valid moves for black pawn to capture white pawn
    const validMoves2 = pawn2.getMoves(board);
    expect(validMoves2).toEqual([
      { square: "h5", isCapture: false, isCheck: false, isPromotion: false },
      { square: "g5", isCapture: true, isCheck: false, isPromotion: false },
    ]);

    // Prevent pawn from capturing own piece
    board.setSquare("g5", new Pawn("black", "g5"));
    const validMoves3 = pawn2.getMoves(board);
    expect(validMoves3).toEqual([
      { square: "h5", isCapture: false, isCheck: false, isPromotion: false },
    ]);

    // Prevent pawn from capturing King
    board.setSquare("g5", new King("white", "g5"));
    const validMoves4 = pawn2.getMoves(board);
    expect(validMoves4).toEqual([
      { square: "h5", isCapture: false, isCheck: false, isPromotion: false },
    ]);

    // Ensure pawn can capture multiple pieces
    const board2 = new Board();
    board2.setSquare("e5", new Pawn("black", "e5"));
    board2.setSquare("d4", new Queen("white", "d4"));
    board2.setSquare("f4", new Rook("white", "f4"));

    const pawn3 = board2.getSquare("e5") as Pawn;
    const validMoves5 = pawn3.getMoves(board2);
    expect(validMoves5).toEqual([
      { square: "e4", isCapture: false, isCheck: false, isPromotion: false },
      { square: "d4", isCapture: true, isCheck: false, isPromotion: false },
      { square: "f4", isCapture: true, isCheck: false, isPromotion: false },
    ]);
  });
});

describe("Pawn check", () => {
  test("should allow pawn to check opponent King", () => {
    const board = new Board();
    board.setSquare("b4", new King("black", "b4"));

    const pawn = board.getSquare("a2") as Pawn;
    // Check valid moves for white pawn to check black King
    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      { square: "a3", isCapture: false, isCheck: true, isPromotion: false },
      { square: "a4", isCapture: false, isCheck: false, isPromotion: false },
    ]);
  });
});

describe("Pawn promotion", () => {
  test("should allow pawn to promote", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a7");
    board.setSquare("a8", null);

    // Check valid moves for white pawn at promotion rank
    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      { square: "a8", isCapture: false, isCheck: false, isPromotion: true },
      { square: "b8", isCapture: true, isCheck: false, isPromotion: true },
    ]);

    const pawn2 = new Pawn("black", "h2");
    board.setSquare("h1", null);

    // Check valid moves for black pawn at promotion rank
    const validMoves2 = pawn2.getMoves(board);
    expect(validMoves2).toEqual([
      { square: "h1", isCapture: false, isCheck: false, isPromotion: true },
      { square: "g1", isCapture: true, isCheck: false, isPromotion: true },
    ]);
  });
});
