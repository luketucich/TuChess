import { describe, expect, test } from "vitest";
import { Board } from "../game/Board.ts";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { Knight } from "../game/Pieces/Knight.ts";
import { Bishop } from "../game/Pieces/Bishop.ts";
import { Rook } from "../game/Pieces/Rook.ts";
import { Queen } from "../game/Pieces/Queen.ts";
import { King } from "../game/Pieces/King.ts";
import { Player } from "../game/Player.ts";

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

describe("Pawn moves", () => {
  test("should correctly move pawns on the board", () => {
    // Single move
    const board = new Board();
    const pawn = board.getSquare("a2") as Pawn;
    board.movePiece("a2", "a3");
    expect(board.getSquare("a3")).toBe(pawn);
    expect(board.getSquare("a2")).toBe(null);
    expect(pawn.getHasMoved()).toBeTruthy();
    expect(pawn.getPosition()).toBe("a3");

    // Double move
    const board2 = new Board();
    const pawn2 = board2.getSquare("a2") as Pawn;
    board2.movePiece("a2", "a4");
    expect(board2.getSquare("a4")).toBe(pawn2);
    expect(board2.getSquare("a2")).toBe(null);
    expect(pawn2.getHasMoved()).toBeTruthy();
    expect(pawn2.getPosition()).toBe("a4");

    // Capture move (one option)
    const board3 = new Board();
    const player1 = new Player("white", true);
    board3.setSquare("e4", new Pawn("white", "e4"));
    board3.setSquare("d5", new Queen("black", "d5"));
    const pawn3 = board3.getSquare("e4") as Pawn;
    const queen = board3.getSquare("d5") as Queen;
    board3.movePiece("e4", "d5", player1);
    expect(board3.getSquare("d5")).toBe(pawn3);
    expect(board3.getSquare("e4")).toBe(null);
    expect(player1.getPieces()).toContain(queen);

    // Capture move (two options)
    const board4 = new Board();
    const player2 = new Player("white", true);
    board4.setSquare("e4", new Pawn("white", "e4"));
    board4.setSquare("d5", new Queen("black", "d5"));
    board4.setSquare("f5", new Rook("black", "f5"));
    const pawn4 = board4.getSquare("e4") as Pawn;
    const queen2 = board4.getSquare("d5") as Queen;
    const rook = board4.getSquare("f5") as Rook;
    board4.movePiece("e4", "d5", player2);
    expect(board4.getSquare("d5")).toBe(pawn4);
    expect(board4.getSquare("e4")).toBe(null);
    expect(player2.getPieces()).toContain(queen2);

    // Promotion move

    // En passant move for white pawn
    const board5 = new Board();
    const player3 = new Player("white", true);
    board5.setSquare("a5", new Pawn("white", "a5"));
    board5.movePiece("b7", "b5", player3);
    const pawn5 = board5.getSquare("a5") as Pawn;
    board5.movePiece("a5", "b6", player3);
    expect(board5.getSquare("b6")).toBe(pawn5);
    expect(board5.getSquare("b5")).toBe(null);
    expect(board5.getSquare("a5")).toBe(null);

    // En passant move for black pawn
    const board6 = new Board();
    const player4 = new Player("black", true);
    board6.setSquare("a4", new Pawn("black", "a4"));
    board6.movePiece("b2", "b4", player4);
    const pawn6 = board6.getSquare("a4") as Pawn;
    board6.movePiece("a4", "b3", player4);
    expect(board6.getSquare("b3")).toBe(pawn6);
    expect(board6.getSquare("b4")).toBe(null);
    expect(board6.getSquare("a4")).toBe(null);
  });
});
