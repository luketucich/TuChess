import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pawn.ts";
import { King } from "../game/King.ts";
import { Board } from "../game/Board.ts";

describe("Pawn properties", () => {
  test("should have the correct properties", () => {
    const pawn = new Pawn("white", "a2");

    // Check pawn color
    expect(pawn.getColor()).toBe("white");
    // Check pawn position
    expect(pawn.getPosition()).toBe("a2");
    // Check if pawn has moved
    expect(pawn.getHasMoved()).toBeFalsy();
    // Check pawn value
    expect(pawn.getValue()).toBe(1);

    const pawn2 = new Pawn("black", "h7", true);
    // Check pawn color
    expect(pawn2.getColor()).toBe("black");
    // Check pawn position
    expect(pawn2.getPosition()).toBe("h7");
    // Check if pawn has moved
    expect(pawn2.getHasMoved()).toBeTruthy();
    // Check pawn value
    expect(pawn2.getValue()).toBe(1);
  });
});

describe("White pawn at start", () => {
  test("should have two possible moves if path is clear", () => {
    const pawn = new Pawn("white", "e2");
    const board = new Board();
    const moves = pawn.getMoves(board);

    // Check possible moves for white pawn at start
    expect(moves).toStrictEqual(["e3", "e4"]);
  });
});

describe("Black pawn at start", () => {
  test("should have two possible moves if path is clear", () => {
    const pawn = new Pawn("black", "e7");
    const board = new Board();
    const moves = pawn.getMoves(board);

    // Check possible moves for black pawn at start
    expect(moves).toStrictEqual(["e6", "e5"]);
  });
});

describe("White pawn that has already moved", () => {
  test("should have one possible move if path is clear", () => {
    const pawn = new Pawn("white", "e3", true);
    const board = new Board();
    const moves = pawn.getMoves(board);

    // Check possible move for white pawn that has already moved
    expect(moves).toStrictEqual(["e4"]);
  });
});

describe("Update pawn properties after moving", () => {
  test("should update pawn properties after moving", () => {
    const board = new Board();
    const pawn = board.getSquare("e2") as Pawn;
    board.movePiece("e2", "e4");

    // Check that pawn has moved
    expect(pawn.getHasMoved()).toBeTruthy();
    // Check new position of pawn
    expect(pawn.getPosition()).toBe("e4");

    // Check that pawn is no longer at e2
    expect(board.getSquare("e2")).toBe(null);

    // Check that pawn is now at e4
    expect(board.getSquare("e4")).toBeInstanceOf(Pawn);

    // Check that unmoved black pawn at e7 can move two squares
    const pawn2 = board.getSquare("e7") as Pawn;
    const moves = pawn2.getMoves(board);
    expect(moves).toStrictEqual(["e6", "e5"]);
    // Check if black pawn has not moved
    expect(pawn2.getHasMoved()).toBeFalsy();
  });
});

describe("White pawn captures", () => {
  test("should have two possible captures", () => {
    const board = new Board();
    board.setSquare("d3", new Pawn("black", "d3"));
    board.setSquare("f3", new Pawn("black", "f3"));

    const pawn = board.getSquare("e2") as Pawn;
    const captures = pawn.getCaptures(board);

    // Check possible captures for white pawn
    expect(captures).toStrictEqual(["d3", "f3"]);

    // Check that white pawn can't capture its own piece
    board.setSquare("d3", new Pawn("white", "d3"));
    const capturesAfterMove = pawn.getCaptures(board);
    expect(capturesAfterMove).toStrictEqual(["f3"]);

    // Check that white pawn can't capture an empty square
    board.setSquare("d3", null);
    const capturesAfterMove2 = pawn.getCaptures(board);
    expect(capturesAfterMove2).toStrictEqual(["f3"]);

    // Check that white pawn can't capture king
    const board2 = new Board();
    board2.setSquare("e4", new Pawn("white", "e4"));
    board2.setSquare("f5", new King("black", "f5"));

    const pawn2 = board2.getSquare("e4") as Pawn;
    const captures2 = pawn2.getCaptures(board2);
    expect(captures2).toStrictEqual([]);
  });
});
