import { describe, expect, test } from "vitest";
import { Board } from "../game/Board.ts";

describe("Chess Board", () => {
  test("should initialize with the correct pieces", () => {
    const board = new Board();
    const initialSetup = board.getBoard();

    expect(initialSetup[7][4]).toBe("K"); // White king at e1
    expect(initialSetup[0][4]).toBe("k"); // Black king at e8
    expect(initialSetup[6][0]).toBe("P"); // White pawn at a2
    expect(initialSetup[1][0]).toBe("p"); // Black pawn at a7
  });
});
