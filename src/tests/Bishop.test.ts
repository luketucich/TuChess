import { describe, expect, test } from "vitest";
import { Bishop } from "../game/Bishop.ts";
import { Board } from "../game/Board.ts";

describe("Bishop properties", () => {
  test("should have the correct properties", () => {
    const bishop = new Bishop("white", "c1");

    expect(bishop.getColor()).toBe("white");
    expect(bishop.getPosition()).toBe("c1");
    expect(bishop.getValue()).toBe(3);

    const bishop2 = new Bishop("black", "f8");
    expect(bishop2.getColor()).toBe("black");
    expect(bishop2.getPosition()).toBe("f8");
    expect(bishop2.getValue()).toBe(3);
  });
});

describe("Bishop moves", () => {
  test("should have the correct moves", () => {
    const board = new Board();
    const bishop = board.getSquare("c1") as Bishop;
    const moves = bishop.getMoves(board);

    expect(moves).toStrictEqual([]);

    board.movePiece("d2", "d4");

    const movesAfterMove = bishop.getMoves(board);

    expect(movesAfterMove).toStrictEqual(["d2", "e3", "f4", "g5", "h6"]);

    const board2 = new Board();
    const bishop2 = new Bishop("black", "e4");
    const moves2 = bishop2.getMoves(board2);

    expect(moves2.sort()).toStrictEqual(
      ["d5", "c6", "f5", "g6", "d3", "f3"].sort()
    );
  });
});
