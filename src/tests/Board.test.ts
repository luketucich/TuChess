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
  test("should correctly initialize kings", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[7][4]).toBeInstanceOf(King); // White king at e1
    expect(initialSetup[0][4]).toBeInstanceOf(King); // Black king at e8
  });

  test("should correctly initialize pawns", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[6][0]).toBeInstanceOf(Pawn); // White pawn at a2
    expect(initialSetup[1][0]).toBeInstanceOf(Pawn); // Black pawn at a7
  });

  test("should correctly initialize knights and bishops", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[0][1]).toBeInstanceOf(Knight); // Black knight at b8
    expect(initialSetup[0][2]).toBeInstanceOf(Bishop); // Black bishop at c8
  });

  test("should correctly initialize rooks and queens", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[0][0]).toBeInstanceOf(Rook); // Black rook at a8
    expect(initialSetup[0][3]).toBeInstanceOf(Queen); // Black queen at d8
  });
});

describe("Index to board square", () => {
  test("should convert from top left corner", () => {
    const board = new Board();
    expect(board.indexToSquare([0, 0])).toBe("a8");
  });

  test("should convert from middle of board", () => {
    const board = new Board();
    expect(board.indexToSquare([4, 4])).toBe("e4");
  });

  test("should convert from bottom right corner", () => {
    const board = new Board();
    expect(board.indexToSquare([7, 7])).toBe("h1");
  });

  test("should convert arbitrary position", () => {
    const board = new Board();
    expect(board.indexToSquare([2, 2])).toBe("c6");
  });
});

describe("Board square to index", () => {
  test("should convert from top left corner", () => {
    const board = new Board();
    expect(board.squareToIndex("a8")).toStrictEqual([0, 0]);
  });

  test("should convert from bottom right corner", () => {
    const board = new Board();
    expect(board.squareToIndex("h1")).toStrictEqual([7, 7]);
  });

  test("should convert arbitrary positions", () => {
    const board = new Board();
    expect(board.squareToIndex("d4")).toStrictEqual([4, 3]);
    expect(board.squareToIndex("e4")).toStrictEqual([4, 4]);
  });
});

describe("Check square validity", () => {
  test("should validate legal squares", () => {
    const board = new Board();
    expect(board.isValidSquare("a8")).toBeTruthy();
    expect(board.isValidSquare("e4")).toBeTruthy();
    expect(board.isValidSquare("h1")).toBeTruthy();
    expect(board.isValidSquare("f3")).toBeTruthy();
  });

  test("should invalidate out of range squares", () => {
    const board = new Board();
    expect(board.isValidSquare("a9")).toBeFalsy();
    expect(board.isValidSquare("i8")).toBeFalsy();
  });

  test("should invalidate malformed inputs", () => {
    const board = new Board();
    expect(board.isValidSquare("a")).toBeFalsy();
    expect(board.isValidSquare("")).toBeFalsy();
  });
});

describe("Check index validity", () => {
  test("should validate legal indices", () => {
    const board = new Board();
    expect(board.isValidIndex([0, 0])).toBeTruthy();
    expect(board.isValidIndex([4, 4])).toBeTruthy();
    expect(board.isValidIndex([7, 7])).toBeTruthy();
  });

  test("should invalidate out of range indices", () => {
    const board = new Board();
    expect(board.isValidIndex([-1, 0])).toBeFalsy();
    expect(board.isValidIndex([0, 8])).toBeFalsy();
    expect(board.isValidIndex([8, 8])).toBeFalsy();
    expect(board.isValidIndex([8, -1])).toBeFalsy();
  });
});

describe("Get piece at square", () => {
  test("should return rooks at corner squares", () => {
    const board = new Board();
    expect(board.getSquare("a8")).toBeInstanceOf(Rook); // Black rook
    expect(board.getSquare("h1")).toBeInstanceOf(Rook); // White rook
    expect(board.getSquare("a1")).toBeInstanceOf(Rook); // White rook
  });

  test("should return empty square for middle positions", () => {
    const board = new Board();
    expect(board.getSquare("e4")).toBe(null);
  });

  test("should return other pieces at correct positions", () => {
    const board = new Board();
    expect(board.getSquare("g8")).toBeInstanceOf(Knight); // Black knight
    expect(board.getSquare("c8")).toBeInstanceOf(Bishop); // Black bishop
    expect(board.getSquare("d8")).toBeInstanceOf(Queen); // Black queen
    expect(board.getSquare("e8")).toBeInstanceOf(King); // Black king
  });
});

describe("Get piece at index", () => {
  test("should correctly retrieve square contents from index", () => {
    const board = new Board();
    expect(board.getIndex([0, 0])).toBeInstanceOf(Rook);
  });
});

describe("Pawn moves", () => {
  test("should handle single square pawn move", () => {
    const board = new Board();
    const pawn = board.getSquare("a2") as Pawn;
    const player = new Player("white", true);
    board.movePiece("a2", "a3", player);
    expect(board.getSquare("a3")).toBe(pawn);
    expect(board.getSquare("a2")).toBe(null);
    expect(pawn.getHasMoved()).toBeTruthy();
    expect(pawn.getPosition()).toBe("a3");
  });

  test("should handle initial double square pawn move", () => {
    const board = new Board();
    const pawn = board.getSquare("a2") as Pawn;
    const player = new Player("white", true);
    board.movePiece("a2", "a4", player);
    expect(board.getSquare("a4")).toBe(pawn);
    expect(board.getSquare("a2")).toBe(null);
    expect(pawn.getHasMoved()).toBeTruthy();
    expect(pawn.getPosition()).toBe("a4");
  });

  test("should handle pawn capture with one option", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("d5", new Queen("black", "d5"));
    const pawn = board.getSquare("e4") as Pawn;
    const queen = board.getSquare("d5") as Queen;
    board.movePiece("e4", "d5", player);
    expect(board.getSquare("d5")).toBe(pawn);
    expect(board.getSquare("e4")).toBe(null);
    expect(player.getPieces()).toContain(queen);
  });

  test("should handle pawn capture with multiple options", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("d5", new Queen("black", "d5"));
    board.setSquare("f5", new Rook("black", "f5"));
    const pawn = board.getSquare("e4") as Pawn;
    const queen = board.getSquare("d5") as Queen;
    board.movePiece("e4", "d5", player);
    expect(board.getSquare("d5")).toBe(pawn);
    expect(board.getSquare("e4")).toBe(null);
    expect(player.getPieces()).toContain(queen);
  });

  test("should handle en passant capture for white pawn", () => {
    const board = new Board();
    const player1 = new Player("white", false);
    const player2 = new Player("black", true);
    board.setSquare("a5", new Pawn("white", "a5"));
    board.movePiece("b7", "b5", player2);
    const pawn1 = board.getSquare("a5") as Pawn;
    const pawn2 = board.getSquare("b5") as Pawn;
    player1.setIsTurn(true);
    player2.setIsTurn(false);
    board.movePiece("a5", "b6", player1);
    expect(board.getSquare("b6")).toBe(pawn1);
    expect(board.getSquare("b5")).toBe(null);
    expect(board.getSquare("a5")).toBe(null);
    expect(player1.getPieces()).toContain(pawn2);
  });

  test("should handle en passant capture for black pawn", () => {
    const board = new Board();
    const player1 = new Player("black", false);
    const player2 = new Player("white", true);
    board.setSquare("a4", new Pawn("black", "a4"));
    board.movePiece("b2", "b4", player2);
    const pawn1 = board.getSquare("a4") as Pawn;
    const pawn2 = board.getSquare("b4") as Pawn;
    player2.setIsTurn(false);
    player1.setIsTurn(true);
    board.movePiece("a4", "b3", player1);
    expect(board.getSquare("b3")).toBe(pawn1);
    expect(board.getSquare("b4")).toBe(null);
    expect(board.getSquare("a4")).toBe(null);
    expect(player1.getPieces()).toContain(pawn2);
  });
});
