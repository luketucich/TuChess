import { Board } from "../Board.ts";
import { BoardMove } from "../Board.ts";
import { Player } from "../Player.ts";

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

  filterSelfCheck(
    board: Board,
    startSquare: string,
    moves: BoardMove[],
    color: "white" | "black"
  ): BoardMove[] {
    const boardClone = board.cloneBoard();
    const testPlayer = new Player(color, true);
    const kingPos = boardClone.getKingPosition(color);

    return moves.filter((move) => {
      boardClone.movePiece(startSquare, move.square, testPlayer);

      const selfCheck: boolean = boardClone.isSquareAttacked(kingPos, color);
      boardClone.undoMove();

      return !selfCheck;
    });
  }
}
