import { describe, expect, test } from "vitest";
import { Queen } from "../game/Queen.ts";
import { Board } from "../game/Board.ts";

describe("Queen properties", () => {
  test("should have the correct properties", () => {
    const queen = new Queen("white", "d1");

    // Check if the Queen's color is correct
    expect(queen.getColor()).toBe("white");
    // Check if the Queen's position is correct
    expect(queen.getPosition()).toBe("d1");
    // Check if the Queen's value is correct
    expect(queen.getValue()).toBe(9);

    const queen2 = new Queen("black", "d8");
    // Check if the second Queen's color is correct
    expect(queen2.getColor()).toBe("black");
    // Check if the second Queen's position is correct
    expect(queen2.getPosition()).toBe("d8");
    // Check if the second Queen's value is correct
    expect(queen2.getValue()).toBe(9);
  });
});

describe("Queen moves", () => {
  test("should have the correct moves", () => {
    const board = new Board();
    const queen = board.getSquare("d1") as Queen;
    const moves = queen.getMoves(board);

    // Check if the Queen has no moves initially
    expect(moves).toStrictEqual([]);

    // Move a piece on the board
    board.movePiece("d2", "d4");

    const movesAfterMove = queen.getMoves(board);

    // Check if the Queen has the correct moves after moving a piece
    expect(movesAfterMove).toStrictEqual(["d2", "d3"]);

    const board2 = new Board();
    const queen2 = new Queen("black", "e4");
    const moves2 = queen2.getMoves(board2);

    // Check if the second Queen has the correct moves
    expect(moves2.sort()).toStrictEqual(
      [
        "d5",
        "c6",
        "f5",
        "g6",
        "d3",
        "f3",
        "a4",
        "b4",
        "c4",
        "d4",
        "e3",
        "e5",
        "e6",
        "f4",
        "g4",
        "h4",
      ].sort()
    );
  });
});
