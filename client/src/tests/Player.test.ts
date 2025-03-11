import { describe, expect, test } from "vitest";
import { Player } from "../game/Player.ts";

describe("Player properties", () => {
  test("should have the correct color", () => {
    const player = new Player("white", true);
    expect(player.getColor()).toBe("white");
  });

  test("should have the correct turn status", () => {
    const player = new Player("white", true);
    expect(player.getIsTurn()).toBeTruthy();
  });

  test("should initialize with empty pieces array", () => {
    const player = new Player("white", true);
    expect(player.getPieces()).toEqual([]);
  });
});

describe("Update player turn", () => {
  test("should initially have the assigned turn value", () => {
    const player = new Player("white", true);
    expect(player.getIsTurn()).toBeTruthy();
  });

  test("should update player turn when changed", () => {
    const player = new Player("white", true);
    player.setIsTurn(false);
    expect(player.getIsTurn()).toBeFalsy();
  });
});
