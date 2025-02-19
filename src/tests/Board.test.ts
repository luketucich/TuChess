import { describe, expect, test } from "vitest";
import { Board } from "../game/Board.ts";
import { Pawn } from "../game/Pawn.ts";
import { Knight } from "../game/Knight.ts";
import { Bishop } from "../game/Bishop.ts";
import { Rook } from "../game/Rook.ts";
import { Queen } from "../game/Queen.ts";
import { King } from "../game/King.ts";

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

    // Validate board indices
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

describe("Try to move pawn to invalid square", () => {
  test("should throw an error if trying to move a pawn to an invalid square", () => {
    const board = new Board();

    // Attempt to move pawn to invalid squares
    expect(() => board.movePiece("e2", "e9")).toThrow("Invalid square");
    expect(() => board.movePiece("e2", "i2")).toThrow("Invalid square");
    expect(() => board.movePiece("e2", "i9")).toThrow("Invalid square");
  });
});

describe("Try to move piece from empty square", () => {
  test("should throw an error if trying to move a piece from an empty square", () => {
    const board = new Board();

    // Attempt to move piece from empty squares
    expect(() => board.movePiece("e3", "e4")).toThrow(
      "No piece at from square"
    );
    expect(() => board.movePiece("a5", "a6")).toThrow(
      "No piece at from square"
    );
  });
});

describe("Move pawn", () => {
  test("should move a pawn from one square to another", () => {
    const board = new Board();

    // Move white pawn from e2 to e4
    expect(board.getSquare("e2")).toBeInstanceOf(Pawn);
    expect(board.getSquare("e4")).toBe(null);

    board.movePiece("e2", "e4");

    expect(board.getSquare("e2")).toBe(null);
    expect(board.getSquare("e4")).toBeInstanceOf(Pawn);

    // Move black pawn from e7 to e5
    expect(board.getSquare("e7")).toBeInstanceOf(Pawn);
    expect(board.getSquare("e5")).toBe(null);

    board.movePiece("e7", "e5");
  });
});

describe("Make illegal pawn move", {}, () => {
  test("should throw an error if trying to make an illegal pawn move", () => {
    const board = new Board();

    // Move white pawn three squares forward
    expect(() => board.movePiece("e2", "e5")).toThrow("Illegal move");

    // Move white pawn two squares forward after it has already moved
    board.movePiece("e2", "e4");
    expect(() => board.movePiece("e4", "e6")).toThrow("Illegal move");

    // Move white pawn forward if there is a piece in the way
    board.movePiece("d7", "d5");
    board.movePiece("d2", "d4");

    expect(() => board.movePiece("d4", "d5")).toThrow("Illegal move");
  });
});

describe("Move knight", () => {
  test("should move a knight from one square to another", () => {
    const board = new Board();

    // Move white knight from b1 to c3
    expect(board.getSquare("b1")).toBeInstanceOf(Knight);
    expect(board.getSquare("c3")).toBe(null);

    board.movePiece("b1", "c3");

    expect(board.getSquare("b1")).toBe(null);
    expect(board.getSquare("c3")).toBeInstanceOf(Knight);

    // Move black knight from g8 to f6
    expect(board.getSquare("g8")).toBeInstanceOf(Knight);
    expect(board.getSquare("f6")).toBe(null);

    board.movePiece("g8", "f6");
  });
});

describe("Make illegal knight move", () => {
  test("should throw an error if trying to make an illegal knight move", () => {
    const board = new Board();

    // Attempt to make illegal knight moves
    expect(() => board.movePiece("b1", "b3")).toThrow("Illegal move");

    // Occupied square
    expect(() => board.movePiece("b1", "d2")).toThrow("Illegal move");
  });
});

describe("Move bishop", () => {
  test("should move a bishop from one square to another", () => {
    // Move white bishop from f1 to c4
    const board = new Board();
    board.movePiece("e2", "e4");
    expect(board.getSquare("f1")).toBeInstanceOf(Bishop);
    expect(board.getSquare("c4")).toBe(null);

    board.movePiece("f1", "c4");
  });
});

describe("Make illegal bishop move", () => {
  test("should throw an error if trying to make an illegal bishop move", () => {
    const board = new Board();

    // Attempt to make illegal bishop moves
    expect(() => board.movePiece("f1", "f4")).toThrow("Illegal move");

    // Occupied square
    expect(() => board.movePiece("f1", "c4")).toThrow("Illegal move");
  });
});

describe("Move rook", () => {
  test("should move a rook from one square to another", () => {
    // Move white rook from a1 to a3
    const board = new Board();
    board.movePiece("a2", "a4");

    expect(board.getSquare("a1")).toBeInstanceOf(Rook);
    expect(board.getSquare("a3")).toBe(null);

    board.movePiece("a1", "a3");

    expect(board.getSquare("a1")).toBe(null);
    expect(board.getSquare("a3")).toBeInstanceOf(Rook);
  });
});

describe("Make illegal rook move", () => {
  test("should throw an error if trying to make an illegal rook move", () => {
    const board = new Board();

    // Attempt to make illegal rook moves
    expect(() => board.movePiece("a1", "a4")).toThrow("Illegal move");

    // Occupied square
    expect(() => board.movePiece("a1", "a2")).toThrow("Illegal move");

    // Invalid square
    expect(() => board.movePiece("a1", "z")).toThrow("Invalid square");
  });
});

describe("Move queen", () => {
  test("should move a queen from one square to another", () => {
    // Move white queen from d1 to d3
    const board = new Board();
    board.movePiece("d2", "d4");

    expect(board.getSquare("d1")).toBeInstanceOf(Queen);
    expect(board.getSquare("d3")).toBe(null);

    board.movePiece("d1", "d3");

    expect(board.getSquare("d1")).toBe(null);
    expect(board.getSquare("d3")).toBeInstanceOf(Queen);

    // Move queen from d3 to a6
    board.movePiece("d3", "a6");
  });
});

describe("Make illegal queen move", () => {
  test("should throw an error if trying to make an illegal queen move", () => {
    const board = new Board();

    // Attempt to make illegal queen moves
    expect(() => board.movePiece("d1", "d4")).toThrow("Illegal move");

    // Occupied square
    expect(() => board.movePiece("d1", "d2")).toThrow("Illegal move");

    // Invalid square
    expect(() => board.movePiece("d1", "z")).toThrow("Invalid square");
  });
});
