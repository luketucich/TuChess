import { Game, User } from "../models/interfaces";
import { Server } from "socket.io";

export function validateMove(
  io: Server,
  roomId: string,
  game: Game,
  user: User,
  from: string,
  to: string,
  promotionType?: "queen" | "rook" | "bishop" | "knight"
): boolean {
  const board = game.board;
  const player = user.color === "white" ? game.white : game.black;
  const opponent = user.color === "white" ? game.black : game.white;

  try {
    if (promotionType !== undefined) {
      board.movePiece(from, to, player, promotionType);
    } else {
      board.movePiece(from, to, player);
    }

    const move = board.getHistory()[board.getHistory().length - 1];

    if (move.getMove().isCapture) {
      const playerPieces = player.getPieces().map((piece) => piece.getName());
      io.emit("update-pieces", playerPieces, player.getColor());
    }

    player.setIsTurn(false);
    opponent.setIsTurn(true);

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An error occurred during move validation");
    }
    return false;
  }
}
