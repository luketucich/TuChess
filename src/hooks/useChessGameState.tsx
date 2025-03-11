import { useState } from "react";
import { Board } from "../game/Board.ts";
import { Player } from "../game/Player.ts";
import { BoardMove } from "../game/Board.ts";

const useChessGameState = () => {
  const [board, setBoard] = useState<Board>(new Board());
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Selection state
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [detailedAvailableMoves, setDetailedAvailableMoves] = useState<
    BoardMove[]
  >([]);
  const [fromSquare, setFromSquare] = useState<string | null>(null);

  // Check for game ending conditions
  const checkGameStatus = (newBoard: Board) => {
    if (
      newBoard.isCheckmateOrStalemate("black") !== "none" ||
      newBoard.isCheckmateOrStalemate("white") !== "none"
    ) {
      setGameOver(true);
    }
  };

  // Handle square selection
  const selectSquare = (square: string) => {
    const piece = board.getSquare(square);

    if (!piece || piece.getColor() !== turn) {
      setFromSquare(null);
      setAvailableMoves([]);
      return;
    }

    const moves = piece.getMoves(board);
    setFromSquare(square);
    setAvailableMoves(moves.map((move) => move.square));
    setDetailedAvailableMoves(moves);
  };

  // Handle piece movement
  const movePiece = (square: string) => {
    if (!fromSquare) return;

    const piece = board.getSquare(fromSquare);
    if (!piece) return;

    const moves = piece.getMoves(board);
    const validMoveSquares = moves.map((move) => move.square);

    if (!validMoveSquares.includes(square)) {
      selectSquare(square);
      return;
    }

    // Clone the board to avoid direct state mutation
    const newBoard = board.cloneBoard();
    newBoard.movePiece(fromSquare, square, new Player(piece.getColor(), true));

    // Update state
    setBoard(newBoard);
    setFromSquare(null);
    setAvailableMoves([]);
    setTurn(turn === "white" ? "black" : "white");

    // Check for game over conditions
    checkGameStatus(newBoard);
  };

  return {
    board,
    turn,
    gameOver,
    availableMoves,
    detailedAvailableMoves,
    fromSquare,
    selectSquare,
    movePiece,
  };
};

export default useChessGameState;
