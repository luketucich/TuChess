import { Board } from "../Board.ts";

export abstract class Piece {
  protected color: "white" | "black";
  protected position: string;
  protected value: number;
  protected name: string;

  constructor(
    color: "white" | "black",
    position: string,
    value: number,
    name: string
  ) {
    this.color = color;
    this.position = position;
    this.value = value;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

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

  isCapture(board: Board, move: [number, number]): boolean {
    const [row, col] = move;

    if (!board.isValidIndex([row, col])) return false; // Out-of-bounds check

    const square = board.getBoard()[row][col];

    return (
      square !== null &&
      square.getColor() !== this.color &&
      !square.getName().includes("king")
    );
  }
}
