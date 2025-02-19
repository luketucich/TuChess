import { describe, expect, test } from "vitest";
import { King } from "../game/King.ts";
import { Board } from "../game/Board.ts";

describe("King properties", () => {
  test("should have the correct properties", () => {
    const king = new King("white", "e1");

    // Check the color of the king
    expect(king.getColor()).toBe("white");
    // Check the position of the king
    expect(king.getPosition()).toBe("e1");
    // Check the value of the king
    expect(king.getValue()).toBe(Infinity);

    const king2 = new King("black", "e8");
    // Check the color of the second king
    expect(king2.getColor()).toBe("black");
    // Check the position of the second king
    expect(king2.getPosition()).toBe("e8");
    // Check the value of the second king
    expect(king2.getValue()).toBe(Infinity);
  });
});

describe("King moves", () => {
  test("should have the correct moves", () => {
    const board = new Board();
    const king = board.getSquare("e1") as King;
    const moves = king.getMoves(board);

    // Check the initial moves of the king
    expect(moves).toStrictEqual([]);

    // Move a piece to allow the king to move
    board.movePiece("e2", "e4");

    const movesAfterMove = king.getMoves(board);

    // Check the moves of the king after moving a piece
    expect(movesAfterMove).toStrictEqual(["e2"]);

    const board2 = new Board();
    const king2 = new King("black", "e4");
    const moves2 = king2.getMoves(board2);

    // Check the moves of the second king
    expect(moves2.sort()).toStrictEqual(
      ["d3", "d4", "d5", "e3", "e5", "f3", "f4", "f5"].sort()
    );
  });
});

describe("King collision checker", () => {
  test("should prevent the king from moving to a square adjacent to enemy king", () => {
    // Create a board with a white king at e4 and a black king at g4
    const board = new Board();
    board.setSquare("e4", new King("white", "e4"));

    const king = board.getSquare("e4") as King;

    board.setSquare("g4", new King("black", "g4"));

    const moves = king.getMoves(board);

    expect(moves.sort()).toStrictEqual(["d3", "d4", "d5", "e3", "e5"].sort());

    // Should allow the king to move to a square not adjacent to enemy king
    const board2 = new Board();
    board2.setSquare("e1", null);
    board2.setSquare("e2", new King("white", "e2"));

    const king2 = board2.getSquare("e2") as King;
    const moves2 = king2.getMoves(board2);

    expect(moves2.sort()).toStrictEqual(["e1", "e3", "d3", "f3"].sort());
  });
});
