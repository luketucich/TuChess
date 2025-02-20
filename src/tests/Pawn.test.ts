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
