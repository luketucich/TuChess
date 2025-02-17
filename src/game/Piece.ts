import { Board } from "../game/Board.ts";

export abstract class Piece {
  protected color: "white" | "black";
  protected hasMoved: boolean;
  protected position: string;
  protected value: number;

  constructor(
    color: "white" | "black",
    position: string,
    hasMoved: boolean = false,
    value: number
  ) {
    this.color = color;
    this.position = position;
    this.hasMoved = hasMoved;
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

  getHasMoved(): boolean {
    return this.hasMoved;
  }
}
