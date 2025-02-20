import { describe, expect, test } from "vitest";
import { Knight } from "../game/Knight.ts";
import { Pawn } from "../game/Pawn.ts";
import { King } from "../game/King.ts";
import { Board } from "../game/Board.ts";

describe("Knight properties", () => {
  test("should have the correct properties", () => {
    const knight = new Knight("white", "b1");

    // Check the color of the knight
    expect(knight.getColor()).toBe("white");
    // Check the position of the knight
    expect(knight.getPosition()).toBe("b1");
    // Check the value of the knight
    expect(knight.getValue()).toBe(3);

    const knight2 = new Knight("black", "g8");
    // Check the color of the second knight
    expect(knight2.getColor()).toBe("black");
    // Check the position of the second knight
    expect(knight2.getPosition()).toBe("g8");
    // Check the value of the second knight
    expect(knight2.getValue()).toBe(3);
  });
});

describe("Knight moves", () => {
  test("should have the correct moves", () => {
    const board = new Board();
    const knight = board.getSquare("b1") as Knight;
    const moves = knight.getMoves(board);

    // Check the possible moves for the knight at b1
    expect(moves).toStrictEqual(["a3", "c3"]);

    const knight2 = new Knight("black", "e4");
    const moves2 = knight2.getMoves(board);

    // Check the possible moves for the knight at e4
    expect(moves2.sort()).toStrictEqual(
      ["c3", "g3", "g5", "f6", "d6", "c5"].sort()
    );

    const knight3 = board.getSquare("g8") as Knight;
    const moves3 = knight3.getMoves(board);

    // Check the possible moves for the knight at g8
    expect(moves3.sort()).toStrictEqual(["h6", "f6"].sort());
  });
});

describe("Knight captures", () => {
  test("should have the correct captures", () => {
    const board = new Board();
    const knight = new Knight("white", "b1");
    const knight2 = new Knight("black", "c3");
    board.setSquare("b1", knight);
    board.setSquare("c3", knight2);

    const captures = knight.getCaptures(board);

    // Check the possible captures for the white knight at b1
    expect(captures).toStrictEqual(["c3"]);

    // Do not let the knight capture its own piece or a King
    board.setSquare("c3", new Knight("white", "c3"));
    board.setSquare("d5", new King("black", "d5"));
    board.setSquare("b5", new Pawn("white", "b5"));

    const knight3 = board.getSquare("c3") as Knight;
    const captures2 = knight3.getCaptures(board);

    expect(captures2).toStrictEqual([]);
  });
});
