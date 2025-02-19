import { describe, expect, test } from "vitest";
import { Rook } from "../game/Rook.ts";
import { Board } from "../game/Board.ts";

describe("Rook properties", () => {
  test("should have the correct properties", () => {
    const rook = new Rook("white", "a1");

    // Check the color of the rook
    expect(rook.getColor()).toBe("white");
    // Check the position of the rook
    expect(rook.getPosition()).toBe("a1");
    // Check the value of the rook
    expect(rook.getValue()).toBe(5);

    const rook2 = new Rook("black", "h8");
    // Check the color of the second rook
    expect(rook2.getColor()).toBe("black");
    // Check the position of the second rook
    expect(rook2.getPosition()).toBe("h8");
    // Check the value of the second rook
    expect(rook2.getValue()).toBe(5);
  });
});

describe("Rook moves", () => {
  test("should have the correct moves", () => {
    const board = new Board();
    const rook = board.getSquare("a1") as Rook;
    const moves = rook.getMoves(board);

    // Check the initial moves of the rook
    expect(moves).toStrictEqual([]);

    // Move a piece to open up the rook's path
    board.movePiece("a2", "a4");

    const movesAfterMove = rook.getMoves(board);

    // Check the moves of the rook after moving a piece
    expect(movesAfterMove).toStrictEqual(["a2", "a3"]);

    const board2 = new Board();
    const rook2 = new Rook("black", "e4");
    const moves2 = rook2.getMoves(board2);

    // Check the possible moves of the rook from the center of the board
    expect(moves2.sort()).toStrictEqual(
      ["a4", "b4", "c4", "d4", "e3", "e5", "e6", "f4", "g4", "h4"].sort()
    );
  });
});
