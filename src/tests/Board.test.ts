import { describe, expect, test } from "vitest";
import { Board } from "../game/Board.ts";

describe("Chess Board Initialization", () => {
  test("should initialize with the correct pieces", () => {
    const board = new Board();
    const initialSetup = board.getBoard();

    expect(initialSetup[7][4]).toBe("K"); // White king at e1
    expect(initialSetup[0][4]).toBe("k"); // Black king at e8
    expect(initialSetup[6][0]).toBe("P"); // White pawn at a2
    expect(initialSetup[1][0]).toBe("p"); // Black pawn at a7
  });
});

describe("Index to board square", () => {
  test("should convert [][] index to corresponding square on chess board", () => {
    const board = new Board();

    expect(board.indexToSquare([0, 0])).toBe("a8");
    expect(board.indexToSquare([4, 4])).toBe("e4");
    expect(board.indexToSquare([7, 7])).toBe("h1");
    expect(board.indexToSquare([2, 2])).toBe("c6");
  });
});
