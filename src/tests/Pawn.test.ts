import { describe, expect, test } from "vitest";
import { Pawn } from "../game/Pawn.ts";

describe("Pawn properties", () => {
  test("should have the correct properties", () => {
    const pawn = new Pawn("white", "a2");

    expect(pawn.getColor()).toBe("white");
    expect(pawn.getPosition()).toBe("a2");
    expect(pawn.getHasMoved()).toBeFalsy();
    expect(pawn.getValue()).toBe(1);
  });
});
