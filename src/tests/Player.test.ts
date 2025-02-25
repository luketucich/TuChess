import { describe, expect, test } from "vitest";
import { Player } from "../game/Player.ts";

describe("Player properties", () => {
  test("should have the correct properties", () => {
    const player = new Player("white", true);

    // Check player color
    expect(player.getColor()).toBe("white");
    // Check player turn
    expect(player.getIsTurn()).toBeTruthy();
    // Check player pieces
    expect(player.getPieces()).toEqual([]);
  });
});

describe("Update player turn", () => {
  test("should update player turn correctly", () => {
    const player = new Player("white", true);

    // Check player turn
    expect(player.getIsTurn()).toBeTruthy();
    // Update player turn
    player.setIsTurn(false);
    // Check player turn
    expect(player.getIsTurn()).toBeFalsy();
  });
});
