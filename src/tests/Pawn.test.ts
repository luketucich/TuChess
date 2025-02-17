import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pawn.ts";
import { Board } from "../game/Board.ts";

describe("Pawn properties", () => {
  test("should have the correct properties", () => {
    const pawn = new Pawn("white", "a2");

    expect(pawn.getColor()).toBe("white");
    expect(pawn.getPosition()).toBe("a2");
    expect(pawn.getHasMoved()).toBeFalsy();
    expect(pawn.getValue()).toBe(1);

    const pawn2 = new Pawn("black", "h7", true);
    expect(pawn2.getColor()).toBe("black");
    expect(pawn2.getPosition()).toBe("h7");
    expect(pawn2.getHasMoved()).toBeTruthy();
    expect(pawn2.getValue()).toBe(1);
  });
});

describe("White pawn at start", () => {
  test("should have two possible moves if path is clear", () => {
    const pawn = new Pawn("white", "e2");
    const board = new Board();
    const moves = pawn.getMoves(board);

    expect(moves).toStrictEqual(["e3", "e4"]);
  });
});

describe("Black pawn at start", () => {
  test("should have two possible moves if path is clear", () => {
    const pawn = new Pawn("black", "e7");
    const board = new Board();
    const moves = pawn.getMoves(board);

    expect(moves).toStrictEqual(["e6", "e5"]);
  });
});
