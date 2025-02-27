import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { Knight } from "../game/Pieces/Knight.ts";
import { Rook } from "../game/Pieces/Rook.ts";
import { Board } from "../game/Board.ts";

describe("Knight properties", () => {
  test("should have the correct properties", () => {
    const knight = new Knight("white", "b1");

    // White knight at b1
    expect(knight.getColor()).toBe("white");
    expect(knight.getPosition()).toBe("b1");
    expect(knight.getValue()).toBe(3);

    const knight2 = new Knight("black", "g8");

    // Black knight at g8
    expect(knight2.getColor()).toBe("black");
    expect(knight2.getPosition()).toBe("g8");
    expect(knight2.getValue()).toBe(3);
  });
});

describe("Knight movement", () => {
  test("should allow knight to move in L-shape", () => {
    const board = new Board();
    const knight = new Knight("white", "b1");

    // Check valid moves for white knight at b1
    const validMoves = knight.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "a3",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "white",
      },
      {
        square: "c3",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "white",
      },
    ]);

    const knight2 = new Knight("black", "g8");

    // Check valid moves for black knight at g8
    const validMoves2 = knight2.getMoves(board);
    expect(validMoves2).toEqual([
      {
        square: "f6",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "black",
      },
      {
        square: "h6",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "black",
      },
    ]);

    const knight3 = new Knight("white", "d4");

    // Check valid moves for white knight at d4
    const validMoves3 = knight3.getMoves(board);
    expect(validMoves3).toEqual(
      expect.arrayContaining([
        {
          square: "b3",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "b5",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "c6",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "e6",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "f3",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "f5",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
      ])
    );
  });
});

describe("Knight capture", () => {
  test("should allow knight to capture opponent's piece", () => {
    const board = new Board();
    const knight = new Knight("white", "b1");

    // Place black pawn at a3
    board.setSquare("a3", new Pawn("black", "a3"));

    // Check valid moves for white knight at b1
    const validMoves = knight.getMoves(board);
    expect(validMoves).toEqual([
      {
        square: "a3",
        isCapture: true,
        isCheck: false,
        piece: "knight",
        color: "white",
      },
      {
        square: "c3",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "white",
      },
    ]);

    const knight2 = new Knight("black", "g8");

    // Place white pawn at f6
    board.setSquare("f6", new Pawn("white", "f6"));

    // Check valid moves for black knight at g8
    const validMoves2 = knight2.getMoves(board);
    expect(validMoves2).toEqual([
      {
        square: "f6",
        isCapture: true,
        isCheck: false,
        piece: "knight",
        color: "black",
      },
      {
        square: "h6",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "black",
      },
    ]);

    const board2 = new Board();
    board.setSquare("d4", new Knight("white", "d4"));
    // Place black pieces at various positions
    board2.setSquare("b3", new Pawn("black", "b3"));
    board2.setSquare("b5", new Rook("black", "b5"));
    board2.setSquare("c6", new Knight("black", "c6"));
    board2.setSquare("e6", new Rook("black", "e6"));
    board2.setSquare("f5", new Knight("black", "f5"));
    board2.setSquare("f3", new Pawn("black", "f3"));

    const knight3 = board.getSquare("d4") as Knight;

    // Check valid moves for white knight at d4
    const validMoves3 = knight3.getMoves(board2);
    expect(validMoves3).toEqual(
      expect.arrayContaining([
        {
          square: "b3",
          isCapture: true,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "b5",
          isCapture: true,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "c6",
          isCapture: true,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "e6",
          isCapture: true,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "f3",
          isCapture: true,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
        {
          square: "f5",
          isCapture: true,
          isCheck: false,
          piece: "knight",
          color: "white",
        },
      ])
    );
  });
});

describe("Knight check", () => {
  test("should allow knight to check opponent King", () => {
    const board = new Board();
    board.setSquare("b4", new Knight("black", "b4"));
    const knight = board.getSquare("b4") as Knight;

    const validMoves = knight.getMoves(board);
    expect(validMoves).toEqual(
      expect.arrayContaining([
        {
          square: "a6",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "black",
        },
        {
          square: "c6",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "black",
        },
        {
          square: "d5",
          isCapture: false,
          isCheck: false,
          piece: "knight",
          color: "black",
        },
        {
          square: "d3",
          isCapture: false,
          isCheck: true,
          piece: "knight",
          color: "black",
        },
      ])
    );

    // Capture with check
    const board2 = new Board();
    board2.setSquare("h5", new Knight("white", "h5"));
    const knight2 = board2.getSquare("h5") as Knight;
    const validMoves2 = knight2.getMoves(board2);

    expect(validMoves2).toEqual([
      {
        square: "g7",
        isCapture: true,
        isCheck: true,
        piece: "knight",
        color: "white",
      },
      {
        square: "g3",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "white",
      },
      {
        square: "f6",
        isCapture: false,
        isCheck: true,
        piece: "knight",
        color: "white",
      },
      {
        square: "f4",
        isCapture: false,
        isCheck: false,
        piece: "knight",
        color: "white",
      },
    ]);
  });
});
