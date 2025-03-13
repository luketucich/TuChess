import { Piece } from "./Pieces/Piece";

export class Player {
  private color: "white" | "black";
  private isTurn: boolean;
  private pieces: Piece[];

  constructor(color: "white" | "black", isTurn: boolean) {
    this.color = color;
    this.isTurn = isTurn;
    this.pieces = [];
  }

  getColor(): "white" | "black" {
    return this.color;
  }

  getIsTurn(): boolean {
    return this.isTurn;
  }

  getPieces(): Piece[] {
    return this.pieces;
  }

  setIsTurn(isTurn: boolean): void {
    this.isTurn = isTurn;
  }

  addPiece(piece: Piece): void {
    this.pieces.push(piece);
  }
}
