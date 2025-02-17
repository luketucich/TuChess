import { describe, expect, test } from "vitest";
import { Board } from "../game/Board.ts";
import { Pawn } from "../game/Pawn.ts";

describe("Chess Board Initialization", () => {
  test("should initialize with the correct pieces", () => {
    const board = new Board();
    const initialSetup = board.getBoard();

    expect(initialSetup[7][4]).toBe("K"); // White king at e1
    expect(initialSetup[0][4]).toBe("k"); // Black king at e8
    expect(initialSetup[6][0]).toBeInstanceOf(Pawn); // White pawn at a2
    expect(initialSetup[1][0]).toBeInstanceOf(Pawn); // Black pawn at a7
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

describe("Board square to index", () => {
  test("should convert square on chess board to corresponding [][] index", () => {
    const board = new Board();

    expect(board.squareToIndex("a8")).toStrictEqual([0, 0]);
    expect(board.squareToIndex("h1")).toStrictEqual([7, 7]);
    expect(board.squareToIndex("d4")).toStrictEqual([4, 3]);
    expect(board.squareToIndex("e4")).toStrictEqual([4, 4]);
  });
});

describe("Check square validity", () => {
  test("should ensure a square is an actual square on the chess board", () => {
    const board = new Board();

    expect(board.squareIsValid("a8")).toBeTruthy();
    expect(board.squareIsValid("e4")).toBeTruthy();
    expect(board.squareIsValid("h1")).toBeTruthy();
    expect(board.squareIsValid("a9")).toBeFalsy();
    expect(board.squareIsValid("i8")).toBeFalsy();
    expect(board.squareIsValid("a")).toBeFalsy();
    expect(board.squareIsValid("")).toBeFalsy();
  });
});

describe("Check index validity", () => {
  test("should ensure an index is a valid index on the chess board", () => {
    const board = new Board();

    expect(board.indexIsValid([0, 0])).toBeTruthy();
    expect(board.indexIsValid([4, 4])).toBeTruthy();
    expect(board.indexIsValid([7, 7])).toBeTruthy();
    expect(board.indexIsValid([-1, 0])).toBeFalsy();
    expect(board.indexIsValid([0, 8])).toBeFalsy();
    expect(board.indexIsValid([8, 8])).toBeFalsy();
    expect(board.indexIsValid([8, -1])).toBeFalsy();
  });
});

describe("Get piece at square", () => {
  test("should return the piece at a given square", () => {
    const board = new Board();

    expect(board.getSquare("a8")).toBe("r"); // Black rook
    expect(board.getSquare("e4")).toBe(null);
    expect(board.getSquare("h1")).toBe("R"); // White rook
    expect(board.getSquare("a1")).toBe("R"); // White rook
  });
});

describe("Move piece", () => {
  test("should move a piece from one square to another", () => {
    const board = new Board();

    // Move white pawn from e2 to e4
    expect(board.getSquare("e2")).toBeInstanceOf(Pawn);
    expect(board.getSquare("e4")).toBe(null);

    board.movePiece("e2", "e4");

    expect(board.getSquare("e2")).toBe(null);
    expect(board.getSquare("e4")).toBeInstanceOf(Pawn);

    // Move black knight from g8 to f6
    expect(board.getSquare("g8")).toBe("n");
    expect(board.getSquare("f6")).toBe(null);

    board.movePiece("g8", "f6");

    expect(board.getSquare("g8")).toBe(null);
    expect(board.getSquare("f6")).toBe("n");
  });
});
