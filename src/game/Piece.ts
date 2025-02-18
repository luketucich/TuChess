import { Board } from "../game/Board.ts";

export abstract class Piece {
  protected color: "white" | "black";
  protected position: string;
  protected value: number;

  constructor(color: "white" | "black", position: string, value: number) {
    this.color = color;
    this.position = position;
    this.value = value;
  }

  abstract getMoves(board: Board): string[];

  getColor(): "white" | "black" {
    return this.color;
  }

  getPosition(): string {
    return this.position;
  }

  getValue(): number {
    return this.value;
  }

  setPosition(position: string): void {
    this.position = position;
  }

  move(position: string): void {
    this.position = position;
  }
}
