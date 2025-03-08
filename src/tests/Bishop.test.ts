import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { King } from "../game/Pieces/King.ts";
import { Bishop } from "../game/Pieces/Bishop.ts";
import { Board } from "../game/Board.ts";
import { Rook } from "../game/Pieces/Rook.ts";

describe("Bishop properties", () => {
  test("white bishop should have the correct properties", () => {
    const bishop = new Bishop("white", "c1");

    // White bishop at c1
    expect(bishop.getColor()).toBe("white");
    expect(bishop.getPosition()).toBe("c1");
    expect(bishop.getValue()).toBe(3);
    expect(bishop.getName()).toBe("bishop");

    const bishop2 = new Bishop("black", "f8");

    // Black bishop at f8
    expect(bishop2.getColor()).toBe("black");
    expect(bishop2.getPosition()).toBe("f8");
    expect(bishop2.getValue()).toBe(3);
    expect(bishop.getName()).toBe("bishop");
  });
});

describe("Bishop movement", () => {
  test("should allow white bishop to move on all four diagonals", () => {
    const board = new Board();

    board.setSquare("e4", new Bishop("white", "e4"));
    const bishop = board.getSquare("e4") as Bishop;
    const moves = bishop.getMoves(board);

    // Use expect.arrayContaining to make order not matter
    expect(moves).toEqual(
      expect.arrayContaining([
        {
          square: "c6",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "d5",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "d3",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "f5",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "f3",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "g6",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "h7",
          isCapture: true,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "b7",
          isCapture: true,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
      ])
    );
  });

  test("should allow the bishop to only move on clear diagonals", () => {
    const board = new Board();

    board.setSquare("e4", new Bishop("white", "e4"));
    board.setSquare("f5", new Pawn("white", "f5"));
    board.setSquare("d5", new Pawn("black", "d5"));
    board.setSquare("f3", new Pawn("black", "f3"));
    const bishop = board.getSquare("e4") as Bishop;
    const moves = bishop.getMoves(board);

    expect(moves).toEqual(
      expect.arrayContaining([
        {
          square: "d3",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "d5",
          isCapture: true,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "f3",
          isCapture: true,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
      ])
    );
  });
});

describe("Bishop checks", () => {
  test("should detect if a bishop is checking the opponent's king", () => {
    // Bishop check with clear path
    const board = new Board();
    board.setSquare("d3", new Bishop("white", "d3"));
    board.setSquare("g6", new King("black", "g6"));
    const bishop: Bishop = board.getSquare("d3") as Bishop;
    const index = board.squareToIndex("d3");

    expect(bishop.isCheck(board, [index[0], index[1]])).toBeTruthy();

    // Bishop check with obstructed path
    const board2 = new Board();
    board2.setSquare("d3", new Bishop("white", "d3"));
    board2.setSquare("e4", new Pawn("white", "e4"));
    board2.setSquare("f5", new King("black", "f5"));
    const bishop2: Bishop = board2.getSquare("d3") as Bishop;
    const index2 = board2.squareToIndex("d3");

    expect(bishop2.isCheck(board2, [index2[0], index2[1]])).toBeFalsy();
  });

  test("should not detect check if bishop is blocked by another piece of the same color", () => {
    const board = new Board();
    board.setSquare("d3", new Bishop("white", "d3"));
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("f5", new King("black", "f5"));
    const bishop: Bishop = board.getSquare("d3") as Bishop;
    const index = board.squareToIndex("d3");

    expect(bishop.isCheck(board, [index[0], index[1]])).toBeFalsy();
  });

  test("should detect check if bishop is blocked by an opponent's piece", () => {
    const board = new Board();
    board.setSquare("d3", new Bishop("white", "d3"));
    board.setSquare("e4", new Pawn("black", "e4"));
    board.setSquare("f5", new King("black", "f5"));
    const bishop: Bishop = board.getSquare("d3") as Bishop;
    const index = board.squareToIndex("d3");

    expect(bishop.isCheck(board, [index[0], index[1]])).toBeFalsy();
  });

  test("should detect check from bottom left", () => {
    // Bottom left
    const board = new Board();
    board.setSquare("d6", new Bishop("white", "d6"));
    board.setSquare("b4", new King("black", "b4"));
    const bishop: Bishop = board.getSquare("d6") as Bishop;
    const index = board.squareToIndex("d6");

    expect(bishop.isCheck(board, [index[0], index[1]])).toBeTruthy();
  });

  test("should detect check from bottom right", () => {
    // Bottom left
    const board = new Board();
    board.setSquare("d6", new Bishop("white", "d6"));
    board.setSquare("f4", new King("black", "f4"));
    const bishop: Bishop = board.getSquare("d6") as Bishop;
    const index = board.squareToIndex("d6");

    expect(bishop.isCheck(board, [index[0], index[1]])).toBeTruthy();
  });

  test("should detect check from top left", () => {
    // Bottom left
    const board = new Board();
    board.setSquare("d4", new Bishop("white", "d4"));
    board.setSquare("b6", new King("black", "b6"));
    const bishop: Bishop = board.getSquare("d4") as Bishop;
    const index = board.squareToIndex("d4");

    expect(bishop.isCheck(board, [index[0], index[1]])).toBeTruthy();
  });

  test("should detect capture check", () => {
    const board = new Board();
    board.setSquare("d5", new Bishop("white", "d5"));
    board.setSquare("e4", new Pawn("black", "e4"));

    const bishop: Bishop = board.getSquare("d5") as Bishop;
    const moves = bishop.getMoves(board);

    expect(moves).toEqual(
      expect.arrayContaining([
        {
          square: "e4",
          isCapture: true,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "c4",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "b3",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "c6",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "b7",
          isCapture: true,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "e6",
          isCapture: false,
          isCheck: false,
          piece: "bishop",
          color: "white",
        },
        {
          square: "f7",
          isCapture: true,
          isCheck: true,
          piece: "bishop",
          color: "white",
        },
      ])
    );
  });
});

describe("should filter out self-check moves", () => {
  test("should not allow bishop to move if pinned", () => {
    const board = new Board();

    // Move bishop in front of king, pinned by rook
    board.setSquare("e2", new Bishop("white", "e2"));
    board.setSquare("e6", new Rook("black", "e6"));

    const filteredMoves = (board.getSquare("e2") as Bishop).getMoves(board);

    expect(filteredMoves).toEqual([]);
  });
});
