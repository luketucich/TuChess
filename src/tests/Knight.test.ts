import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { Knight } from "../game/Pieces/Knight.ts";
import { Rook } from "../game/Pieces/Rook.ts";
import { Board } from "../game/Board.ts";

describe("Knight properties", () => {
  test("should have correct properties for white knight", () => {
    const knight = new Knight("white", "b1");
    expect(knight.getColor()).toBe("white");
    expect(knight.getPosition()).toBe("b1");
    expect(knight.getValue()).toBe(3);
  });

  test("should have correct properties for black knight", () => {
    const knight2 = new Knight("black", "g8");
    expect(knight2.getColor()).toBe("black");
    expect(knight2.getPosition()).toBe("g8");
    expect(knight2.getValue()).toBe(3);
  });
});

describe("Knight movement", () => {
  test("should allow white knight at b1 to move in L-shape", () => {
    const board = new Board();
    const knight = new Knight("white", "b1");

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
  });

  test("should allow black knight at g8 to move in L-shape", () => {
    const board = new Board();
    const knight = new Knight("black", "g8");

    const validMoves = knight.getMoves(board);
    expect(validMoves).toEqual([
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
  });

  test("should allow knight at center position to move in all 8 directions", () => {
    const board = new Board();
    const knight = new Knight("white", "d4");

    const validMoves = knight.getMoves(board);
    expect(validMoves).toEqual(
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
  test("should allow white knight to capture black pawn", () => {
    const board = new Board();
    const knight = new Knight("white", "b1");

    board.setSquare("a3", new Pawn("black", "a3"));

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
  });

  test("should allow black knight to capture white pawn", () => {
    const board = new Board();
    const knight = new Knight("black", "g8");

    board.setSquare("f6", new Pawn("white", "f6"));

    const validMoves = knight.getMoves(board);
    expect(validMoves).toEqual([
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
  });

  test("should allow knight to capture multiple opponent pieces", () => {
    const board = new Board();
    board.setSquare("d4", new Knight("white", "d4"));

    const board2 = new Board();
    board2.setSquare("b3", new Pawn("black", "b3"));
    board2.setSquare("b5", new Rook("black", "b5"));
    board2.setSquare("c6", new Knight("black", "c6"));
    board2.setSquare("e6", new Rook("black", "e6"));
    board2.setSquare("f5", new Knight("black", "f5"));
    board2.setSquare("f3", new Pawn("black", "f3"));

    const knight = board.getSquare("d4") as Knight;

    const validMoves = knight.getMoves(board2);
    expect(validMoves).toEqual(
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
  test("should detect when knight move puts opponent's king in check", () => {
    const board = new Board();
    board.setSquare("b4", new Knight("black", "b4"));
    const knight = board.getSquare("b4") as Knight;

    const validMoves = knight.getMoves(board);
    expect(validMoves).toEqual(
      expect.arrayContaining([
        {
          square: "d3",
          isCapture: false,
          isCheck: true,
          piece: "knight",
          color: "black",
        },
      ])
    );

    // Also verify other valid moves that don't result in check
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
      ])
    );
  });

  test("should detect check when capturing opponent's pieces", () => {
    const board2 = new Board();
    board2.setSquare("h5", new Knight("white", "h5"));
    const knight2 = board2.getSquare("h5") as Knight;
    const validMoves2 = knight2.getMoves(board2);

    // Test check with capture
    expect(validMoves2).toEqual(
      expect.arrayContaining([
        {
          square: "g7",
          isCapture: true,
          isCheck: true,
          piece: "knight",
          color: "white",
        },
      ])
    );

    // Test check without capture
    expect(validMoves2).toEqual(
      expect.arrayContaining([
        {
          square: "f6",
          isCapture: false,
          isCheck: true,
          piece: "knight",
          color: "white",
        },
      ])
    );

    // Test non-check moves
    expect(validMoves2).toEqual(
      expect.arrayContaining([
        {
          square: "g3",
          isCapture: false,
          isCheck: false,
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
      ])
    );
  });
});
