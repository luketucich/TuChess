import { describe, expect, test } from "vitest";
import { Board } from "../game/Board.ts";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { Knight } from "../game/Pieces/Knight.ts";
import { Bishop } from "../game/Pieces/Bishop.ts";
import { Rook } from "../game/Rook.ts";
import { Queen } from "../game/Queen.ts";
import { King } from "../game/Pieces/King.ts";

describe("Chess Board Initialization", () => {
  test("should initialize with the correct pieces", () => {
    const board = new Board();
    const initialSetup = board.getBoard();

    // Check initial positions of kings
    expect(initialSetup[7][4]).toBeInstanceOf(King); // White king at e1
    expect(initialSetup[0][4]).toBeInstanceOf(King); // Black king at e8

    // Check initial positions of pawns
    expect(initialSetup[6][0]).toBeInstanceOf(Pawn); // White pawn at a2
    expect(initialSetup[1][0]).toBeInstanceOf(Pawn); // Black pawn at a7

    // Check initial positions of knights and bishops
    expect(initialSetup[0][1]).toBeInstanceOf(Knight); // Black knight at b8
    expect(initialSetup[0][2]).toBeInstanceOf(Bishop); // Black bishop at c8

    // Check initial positions of rooks and queens
    expect(initialSetup[0][0]).toBeInstanceOf(Rook); // Black rook at a8
    expect(initialSetup[0][3]).toBeInstanceOf(Queen); // Black queen at d8
  });
});

describe("Index to board square", () => {
  test("should convert [][] index to corresponding square on chess board", () => {
    const board = new Board();

    // Convert board indices to chess notation
    expect(board.indexToSquare([0, 0])).toBe("a8");
    expect(board.indexToSquare([4, 4])).toBe("e4");
    expect(board.indexToSquare([7, 7])).toBe("h1");
    expect(board.indexToSquare([2, 2])).toBe("c6");
  });
});

describe("Board square to index", () => {
  test("should convert square on chess board to corresponding [][] index", () => {
    const board = new Board();

    // Convert chess notation to board indices
    expect(board.squareToIndex("a8")).toStrictEqual([0, 0]);
    expect(board.squareToIndex("h1")).toStrictEqual([7, 7]);
    expect(board.squareToIndex("d4")).toStrictEqual([4, 3]);
    expect(board.squareToIndex("e4")).toStrictEqual([4, 4]);
  });
});

describe("Check square validity", () => {
  test("should ensure a square is an actual square on the chess board", () => {
    const board = new Board();

    // Validate chess board squares
    expect(board.isValidSquare("a8")).toBeTruthy();
    expect(board.isValidSquare("e4")).toBeTruthy();
    expect(board.isValidSquare("h1")).toBeTruthy();
    expect(board.isValidSquare("a9")).toBeFalsy();
    expect(board.isValidSquare("i8")).toBeFalsy();
    expect(board.isValidSquare("a")).toBeFalsy();
    expect(board.isValidSquare("")).toBeFalsy();
    expect(board.isValidSquare("f3")).toBeTruthy();
  });
});

describe("Check index validity", () => {
  test("should ensure an index is a valid index on the chess board", () => {
    const board = new Board();

    // Validate board indices
    expect(board.isValidIndex([0, 0])).toBeTruthy();
    expect(board.isValidIndex([4, 4])).toBeTruthy();
    expect(board.isValidIndex([7, 7])).toBeTruthy();
    expect(board.isValidIndex([-1, 0])).toBeFalsy();
    expect(board.isValidIndex([0, 8])).toBeFalsy();
    expect(board.isValidIndex([8, 8])).toBeFalsy();
    expect(board.isValidIndex([8, -1])).toBeFalsy();
  });
});

describe("Get piece at square", () => {
  test("should return the piece at a given square", () => {
    const board = new Board();

    // Get pieces at specific squares
    expect(board.getSquare("a8")).toBeInstanceOf(Rook); // Black rook
    expect(board.getSquare("e4")).toBe(null);
    expect(board.getSquare("h1")).toBeInstanceOf(Rook); // White rook
    expect(board.getSquare("a1")).toBeInstanceOf(Rook); // White rook
    expect(board.getSquare("g8")).toBeInstanceOf(Knight); // Black knight
    expect(board.getSquare("c8")).toBeInstanceOf(Bishop); // Black bishop
    expect(board.getSquare("d8")).toBeInstanceOf(Queen); // Black queen
    expect(board.getSquare("e8")).toBeInstanceOf(King); // Black king
  });
});
