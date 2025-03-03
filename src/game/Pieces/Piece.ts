import { Board } from "../Board.ts";

export abstract class Piece {
  protected color: "white" | "black";
  protected position: string;
  protected value: number;

  constructor(color: "white" | "black", position: string, value: number) {
    this.color = color;
    this.position = position;
    this.value = value;
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

  isKing(): boolean {
    return false;
  }

  isCapture(board: Board, move: [number, number]): boolean {
    const [row, col] = move;

    if (!board.isValidIndex([row, col])) return false; // Out-of-bounds check

    const square = board.getBoard()[row][col];

    return (
      square !== null && square.getColor() !== this.color && !square.isKing()
    );
  }
}
