import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { King } from "../game/Pieces/King.ts";
import { Queen } from "../game/Pieces/Queen.ts";
import { Board } from "../game/Board.ts";

describe("Queen properties", () => {
  test("white queen should have the correct properties", () => {
    const queen = new Queen("white", "d1");

    // White queen at d1
    expect(queen.getColor()).toBe("white");
    expect(queen.getPosition()).toBe("d1");
    expect(queen.getValue()).toBe(9);
    expect(queen.getName()).toBe("queen");
  });

  test("black queen should have the correct properties", () => {
    const queen = new Queen("black", "d8");

    // Black queen at d8
    expect(queen.getColor()).toBe("black");
    expect(queen.getPosition()).toBe("d8");
    expect(queen.getValue()).toBe(9);
    expect(queen.getName()).toBe("queen");
  });
});

describe("Queen movement", () => {
  test("Queen should retrieve correct moves", () => {
    const board = new Board();
    const queen = new Queen("white", "d4");
    board.setSquare("d4", queen);

    const moves = queen.getMoves(board);
    expect(moves).toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "c5",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "b6",
        },
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "queen",
          square: "a7",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "e5",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "f6",
        },
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "queen",
          square: "g7",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "c3",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "e3",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "d5",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "d6",
        },
        {
          color: "white",
          isCapture: true,
          isCheck: true,
          piece: "queen",
          square: "d7",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "d3",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "c4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "b4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "a4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "e4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "f4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "g4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "h4",
        },
      ])
    );
  });

  test("Queen can't move through ally pieces", () => {
    const board = new Board();
    const queen = new Queen("white", "d4");
    const pawn = new Pawn("white", "e5");
    board.setSquare("d4", queen);
    board.setSquare("e5", pawn);

    const moves = queen.getMoves(board);
    expect(moves).not.toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "e5",
        },
      ])
    );
  });
});

describe("Queen captures", () => {
  test("Queen should capture enemy pieces", () => {
    const board = new Board();
    const queen = new Queen("white", "d4");
    const pawn = new Pawn("black", "e5");
    board.setSquare("d4", queen);
    board.setSquare("e5", pawn);

    const moves = queen.getMoves(board);
    expect(moves).toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "queen",
          square: "e5",
        },
      ])
    );
  });

  test("Queen can't capture ally pieces", () => {
    const board = new Board();
    const queen = new Queen("white", "d4");
    const pawn = new Pawn("white", "e5");
    board.setSquare("d4", queen);
    board.setSquare("e5", pawn);

    const moves = queen.getMoves(board);
    expect(moves).not.toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "queen",
          square: "e5",
        },
      ])
    );
  });
});

describe("Queen checks", () => {
  test("Queen should check enemy king", () => {
    const board = new Board();
    const queen = new Queen("white", "d4");
    const king = new King("black", "e5");
    board.setSquare("d4", queen);
    board.setSquare("e5", king);

    const moves = queen.getMoves(board);
    expect(moves).toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "queen",
          square: "c5",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "b6",
        },
        {
          color: "white",
          isCapture: true,
          isCheck: false,
          piece: "queen",
          square: "a7",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "c3",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "queen",
          square: "e3",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "queen",
          square: "d5",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "queen",
          square: "d6",
        },
        {
          color: "white",
          isCapture: true,
          isCheck: true,
          piece: "queen",
          square: "d7",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "d3",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "c4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "b4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "a4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "queen",
          square: "e4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "queen",
          square: "f4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "g4",
        },
        {
          color: "white",
          isCapture: false,
          isCheck: false,
          piece: "queen",
          square: "h4",
        },
      ])
    );
  });

  test("Queen can't check ally king", () => {
    const board = new Board();
    const queen = new Queen("white", "d4");
    const king = new King("white", "e5");
    board.setSquare("d4", queen);
    board.setSquare("e5", king);

    const moves = queen.getMoves(board);
    expect(moves).not.toEqual(
      expect.arrayContaining([
        {
          color: "white",
          isCapture: false,
          isCheck: true,
          piece: "queen",
          square: "e5",
        },
      ])
    );
  });
});
