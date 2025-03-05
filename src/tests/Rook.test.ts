import { describe, expect, test } from "vitest";
import { Rook } from "../game/Pieces/Rook.ts";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { King } from "../game/Pieces/King.ts";
import { Board } from "../game/Board.ts";

describe("Rook properties", () => {
  test("white rook should have the correct properties", () => {
    const rook = new Rook("white", "a1");

    expect(rook.getColor()).toBe("white");
    expect(rook.getPosition()).toBe("a1");
    expect(rook.getValue()).toBe(5);
    expect(rook.getName()).toBe("rook");
  });

  test("black rook should have the correct properties", () => {
    const rook = new Rook("black", "h8");

    expect(rook.getColor()).toBe("black");
    expect(rook.getPosition()).toBe("h8");
    expect(rook.getValue()).toBe(5);
    expect(rook.getName()).toBe("rook");
  });
});

describe("Rook movement", () => {
  test("Rook should retrieve correct moves", () => {
    const board = new Board();
    const rook = new Rook("white", "d4");
    board.setSquare("d4", rook);

    const moves = rook.getMoves(board);
    expect(moves).toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "d5",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "d6",
        },
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "rook",
          square: "d7",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "d3",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "c4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "b4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "a4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "e4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "f4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "g4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "h4",
        },
      ])
    );
  });

  test("Rook can't move through ally pieces", () => {
    const board = new Board();
    const rook = new Rook("white", "d4");
    const pawn = new Pawn("white", "d5");
    board.setSquare("d4", rook);
    board.setSquare("d5", pawn);

    const moves = rook.getMoves(board);
    expect(moves).not.toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "rook",
          square: "d6",
        },
      ])
    );
  });
});

describe("Rook captures", () => {
  test("Rook should capture enemy pieces", () => {
    const board = new Board();
    const rook = new Rook("white", "d4");
    const pawn = new Pawn("black", "d5");
    board.setSquare("d4", rook);
    board.setSquare("d5", pawn);

    const moves = rook.getMoves(board);
    expect(moves).toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "rook",
          square: "d5",
        },
      ])
    );
  });

  test("Rook can't capture ally pieces", () => {
    const board = new Board();
    const rook = new Rook("white", "d4");
    const pawn = new Pawn("white", "d5");
    board.setSquare("d4", rook);
    board.setSquare("d5", pawn);

    const moves = rook.getMoves(board);
    expect(moves).not.toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "rook",
          square: "d5",
        },
      ])
    );
  });
});

describe("Rook checks", () => {
  test("Rook should check enemy king", () => {
    const board = new Board();
    const rook = new Rook("white", "d4");
    const king = new King("black", "e6");
    board.setSquare("d4", rook);
    board.setSquare("e6", king);

    const moves = rook.getMoves(board);
    expect(moves).toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "rook",
          square: "d6",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "rook",
          square: "e4",
        },
      ])
    );
  });

  test("Rook can't check ally king", () => {
    const board = new Board();
    const rook = new Rook("white", "d4");
    const king = new King("white", "e6");
    board.setSquare("d4", rook);
    board.setSquare("e6", king);

    const moves = rook.getMoves(board);
    expect(moves).not.toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "rook",
          square: "d6",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "rook",
          square: "e4",
        },
      ])
    );
  });
});
