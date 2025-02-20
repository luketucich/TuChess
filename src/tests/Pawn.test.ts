import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pawn.ts";
import { King } from "../game/King.ts";
import { Board } from "../game/Board.ts";
import exp from "constants";

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

describe("Pawn moves", () => {
  test("should have the correct moves", () => {
    // Test white pawn moves from starting position
    const board = new Board();
    const pawn = board.getSquare("a2") as Pawn;
    const moves = pawn.getMoves(board).moves;
    expect(moves).toStrictEqual(["a3", "a4"]);

    // Test black pawn moves from starting position
    const pawn2 = board.getSquare("h7") as Pawn;
    const moves2 = pawn2.getMoves(board).moves;
    expect(moves2).toStrictEqual(["h6", "h5"]);

    // Test white pawn moves after moving
    board.movePiece("a2", "a3");
    const movesAfterMove = pawn.getMoves(board).moves;
    expect(movesAfterMove).toStrictEqual(["a4"]);

    // Test black pawn moves after moving
    board.movePiece("h7", "h5");
    const movesAfterMove2 = pawn2.getMoves(board).moves;
    expect(movesAfterMove2).toStrictEqual(["h4"]);

    // Test double pawn move with piece blocking
    const board2 = new Board();
    board2.setSquare("e4", new Pawn("black", "e4"));
    const pawn3 = board2.getSquare("e2") as Pawn;
    const moves3 = pawn3.getMoves(board2).moves;
    expect(moves3).toStrictEqual(["e3"]);

    // Test single pawn move with piece blocking
    const board3 = new Board();
    board3.setSquare("e3", new Pawn("black", "e3"));
    const pawn4 = board2.getSquare("e2") as Pawn;
    const moves4 = pawn4.getMoves(board3).moves;
    expect(moves4).toStrictEqual([]);
  });
});

describe("Pawn captures", () => {
  test("should have the correct captures", () => {
    // Test white pawn single capture
    const board = new Board();
    const pawn = board.getSquare("a2") as Pawn;
    const pawn2 = new Pawn("black", "b3");
    board.setSquare("b3", pawn2);
    const captures = pawn.getMoves(board).captures;
    expect(captures).toStrictEqual(["b3"]);

    // Test white pawn double capture
    const board2 = new Board();
    board2.setSquare("e4", new Pawn("white", "e4"));
    board2.setSquare("d5", new Pawn("black", "d5"));
    board2.setSquare("f5", new Pawn("black", "f5"));
    const pawn3 = board2.getSquare("e4") as Pawn;
    expect(pawn3.getMoves(board2).captures.sort()).toStrictEqual(
      ["d5", "f5"].sort()
    );

    // Test black pawn single capture
    const board3 = new Board();
    const pawn4 = new Pawn("black", "h7");
    const pawn5 = new Pawn("white", "g6");
    board3.setSquare("h7", pawn4);
    board3.setSquare("g6", pawn5);
    const captures2 = pawn4.getMoves(board3).captures;
    expect(captures2).toStrictEqual(["g6"]);

    // Test black pawn double capture
    const board4 = new Board();
    board4.setSquare("e5", new Pawn("black", "e5"));
    board4.setSquare("d4", new Pawn("white", "d4"));
    board4.setSquare("f4", new Pawn("white", "f4"));
    const pawn6 = board4.getSquare("e5") as Pawn;
    expect(pawn6.getMoves(board4).captures.sort()).toStrictEqual(
      ["d4", "f4"].sort()
    );

    // Ensure pawns cannot capture their own pieces or a King
    const board5 = new Board();
    const pawn7 = new Pawn("white", "e4");
    board5.setSquare("e4", pawn7);
    board5.setSquare("d5", new Pawn("white", "d5"));
    board5.setSquare("f5", new King("black", "d4"));
    expect(pawn7.getMoves(board5).captures).toStrictEqual([]);
  });
});

describe("Pawn checks", () => {
  test("should have the correct checks", () => {
    // Test white pawn checks one & two squares away
    const board = new Board();
    board.setSquare("f5", new King("black", "f5"));
    const pawn = board.getSquare("e2") as Pawn;
    const checks = pawn.getMoves(board).checks;
    expect(checks).toStrictEqual(["e4"]);

    board.setSquare("f4", new King("black", "f4"));
    const checks2 = pawn.getMoves(board).checks;
    expect(checks2).toStrictEqual(["e3", "e4"]);

    // Test black pawn checks one & two squares away
    const board2 = new Board();
    board2.setSquare("f4", new King("white", "f4"));
    const pawn2 = board.getSquare("e7") as Pawn;
    const checks3 = pawn2.getMoves(board2).checks;
    expect(checks3).toStrictEqual(["e5"]);

    board2.setSquare("f5", new King("white", "f5"));
    const checks4 = pawn2.getMoves(board2).checks.sort();
    expect(checks4).toStrictEqual(["e5", "e6"].sort());
  });
});
