import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { King } from "../game/Pieces/King.ts";
import { Rook } from "../game/Pieces/Rook.ts";
import { Queen } from "../game/Pieces/Queen.ts";
import { Board } from "../game/Board.ts";

describe("Pawn properties", () => {
  test("should have correct properties for white pawn", () => {
    const pawn = new Pawn("white", "a2");
    expect(pawn.getColor()).toBe("white");
    expect(pawn.getPosition()).toBe("a2");
    expect(pawn.getHasMoved()).toBeFalsy();
    expect(pawn.getValue()).toBe(1);
    expect(pawn.getName()).toBe("pawn");
  });

  test("should have correct properties for black pawn", () => {
    const pawn = new Pawn("black", "h7", true);
    expect(pawn.getColor()).toBe("black");
    expect(pawn.getPosition()).toBe("h7");
    expect(pawn.getHasMoved()).toBeTruthy();
    expect(pawn.getValue()).toBe(1);
    expect(pawn.getName()).toBe("pawn");
  });
});

describe("Pawn movement at start", () => {
  test("should allow white pawn to move 1 or 2 squares forward", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a2");

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "a3",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "white",
      },
      {
        square: "a4",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        isDoubleMove: true,
        piece: "pawn",
        color: "white",
      },
    ]);
  });

  test("should allow black pawn to move 1 or 2 squares forward", () => {
    const board = new Board();
    const pawn = new Pawn("black", "h7");

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "h6",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
      {
        square: "h5",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        isDoubleMove: true,
        piece: "pawn",
        color: "black",
      },
    ]);
  });
});

describe("Pawn movement after start", () => {
  test("should allow white pawn to move 1 square forward", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a3", true);

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "a4",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "white",
      },
    ]);
  });

  test("should allow black pawn to move 1 square forward", () => {
    const board = new Board();
    const pawn = new Pawn("black", "h6", true);

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "h5",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
    ]);
  });
});

describe("Pawn capture", () => {
  test("should allow white pawn to capture diagonally", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a3", true);
    board.setSquare("b4", new Pawn("black", "b4"));

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "a4",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "white",
      },
      {
        square: "b4",
        isCapture: true,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "white",
      },
    ]);
  });

  test("should allow black pawn to capture diagonally", () => {
    const board = new Board();
    const pawn = new Pawn("black", "h6", true);
    board.setSquare("g5", new Pawn("white", "g5"));

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "h5",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
      {
        square: "g5",
        isCapture: true,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
    ]);
  });

  test("should prevent pawn from capturing its own piece", () => {
    const board = new Board();
    const pawn = new Pawn("black", "h6", true);
    board.setSquare("g5", new Pawn("black", "g5"));

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "h5",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
    ]);
  });

  test("should prevent pawn from capturing King", () => {
    const board = new Board();
    const pawn = new Pawn("black", "h6", true);
    board.setSquare("g5", new King("white", "g5"));

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "h5",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
    ]);
  });

  test("should allow pawn to capture multiple pieces", () => {
    const board = new Board();
    board.setSquare("e5", new Pawn("black", "e5"));
    board.setSquare("d4", new Queen("white", "d4"));
    board.setSquare("f4", new Rook("white", "f4"));

    const pawn = board.getSquare("e5") as Pawn;
    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "e4",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
      {
        square: "d4",
        isCapture: true,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
      {
        square: "f4",
        isCapture: true,
        isCheck: false,
        isPromotion: false,
        piece: "pawn",
        color: "black",
      },
    ]);
  });
});

describe("Pawn check", () => {
  test("should allow pawn to check opponent King", () => {
    const board = new Board();
    board.setSquare("b4", new King("black", "b4"));

    const pawn = board.getSquare("a2") as Pawn;
    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "a3",
        isCapture: false,
        isCheck: true,
        isPromotion: false,
        piece: "pawn",
        color: "white",
      },
      {
        square: "a4",
        isCapture: false,
        isCheck: false,
        isPromotion: false,
        isDoubleMove: true,
        piece: "pawn",
        color: "white",
      },
    ]);
  });
});

describe("Pawn promotion", () => {
  test("should allow white pawn to promote", () => {
    const board = new Board();
    const pawn = new Pawn("white", "a7");
    board.setSquare("a8", null);

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "a8",
        isCapture: false,
        isCheck: false,
        isPromotion: true,
        piece: "pawn",
        color: "white",
      },
      {
        square: "b8",
        isCapture: true,
        isCheck: false,
        isPromotion: true,
        piece: "pawn",
        color: "white",
      },
    ]);
  });

  test("should allow black pawn to promote", () => {
    const board = new Board();
    const pawn = new Pawn("black", "h2");
    board.setSquare("h1", null);

    const validMoves = pawn.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "h1",
        isCapture: false,
        isCheck: false,
        isPromotion: true,
        piece: "pawn",
        color: "black",
      },
      {
        square: "g1",
        isCapture: true,
        isCheck: false,
        isPromotion: true,
        piece: "pawn",
        color: "black",
      },
    ]);
  });
});
