import { useState, useEffect, useRef } from "react";
import { Board } from "../game/Board.ts";
import { Player } from "../game/Player.ts";
import { BoardMove } from "../game/Board.ts";
import { Socket } from "socket.io-client";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { PawnMove } from "../game/Moves/PawnMove.ts";

const useChessGameState = (
  playerColor: string,
  socket: Socket | null,
  roomId: string,
  receivedGameState: {
    serializedBoard: string;
    turn: "white" | "black";
    gameOver: boolean;
  } | null
) => {
  // Game state
  const [board, setBoard] = useState<Board>(new Board());
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string>("");

  // Selection state
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [detailedAvailableMoves, setDetailedAvailableMoves] = useState<
    BoardMove[]
  >([]);
  const [fromSquare, setFromSquare] = useState<string | null>(null);

  // Promotion state
  const [promotionSquare, setPromotionSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
    color: "white" | "black";
  } | null>(null);

  // Audio reference
  const moveAudioRef = useRef(new Audio("/assets/move_piece.mp3"));

  // Function to play the move sound
  const playMoveSound = () => {
    moveAudioRef.current.currentTime = 0; // Reset audio to start
    moveAudioRef.current
      .play()
      .catch((err) => console.error("Error playing audio:", err));
  };

  useEffect(() => {
    if (receivedGameState) {
      const newBoard = new Board();
      newBoard.deserializeBoard(receivedGameState.serializedBoard);
      setBoard(newBoard);
      setTurn(receivedGameState.turn);
      setGameOver(receivedGameState.gameOver);

      // Do whatever you need with the message
    }
  }, [receivedGameState]);

  // Set up socket listener for board updates and game over conditions
  useEffect(() => {
    if (!socket) return;

    // Listen for board updates from the server
    socket.on("board-update", (updatedBoardData) => {
      // If we received a lastMove property, apply it to our board
      if (updatedBoardData.lastMove && turn !== playerColor) {
        const { from, to } = updatedBoardData.lastMove;

        playMoveSound();

        // Clone the board to avoid direct state mutation
        const newBoard = board.cloneBoard();
        const piece = newBoard.getSquare(from);

        if (piece) {
          if (updatedBoardData.promotionPiece !== undefined) {
            // Promotion move
            newBoard.movePiece(
              from,
              to,
              new Player(piece.getColor(), true),
              updatedBoardData.promotionPiece
            );
          } else {
            // Apply the move
            newBoard.movePiece(from, to, new Player(piece.getColor(), true));
          }

          // Update state
          setBoard(newBoard);
          setTurn(
            updatedBoardData.turn || (turn === "white" ? "black" : "white")
          );

          // Check for game over conditions
          checkGameStatus(newBoard);

          // Clear selection state
          setFromSquare(null);
          setAvailableMoves([]);
          setDetailedAvailableMoves([]);
        }
      }
    });

    // Listen for game over due to timeout
    socket.on("game-over", (result) => {
      setGameOver(true);
      setGameResult(result.message);
    });

    return () => {
      socket.off("board-update");
      socket.off("game-over");
    };
  }, [socket, board, turn, playerColor]);

  // Check for game ending conditions
  const checkGameStatus = (newBoard: Board) => {
    const whiteStatus = newBoard.isCheckmateOrStalemate("white");
    const blackStatus = newBoard.isCheckmateOrStalemate("black");

    if (whiteStatus !== "none") {
      setGameOver(true);
      setGameResult(
        whiteStatus === "checkmate"
          ? "Black wins by checkmate"
          : "Game drawn by stalemate"
      );
    } else if (blackStatus !== "none") {
      setGameOver(true);
      setGameResult(
        blackStatus === "checkmate"
          ? "White wins by checkmate"
          : "Game drawn by stalemate"
      );
    }
  };

  // Handle square selection
  const selectSquare = (square: string) => {
    if (gameOver) return;

    const piece = board.getSquare(square);

    if (!piece || piece.getColor() !== playerColor || turn !== playerColor) {
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
    if (gameOver || !fromSquare) return;

    const piece = board.getSquare(fromSquare);
    if (!piece) return;

    const moves = piece.getMoves(board);
    const validMoveSquares = moves.map((move) => move.square);

    if (!validMoveSquares.includes(square)) {
      selectSquare(square);
      return;
    }

    if (socket && turn === playerColor) {
      if (piece instanceof Pawn) {
        const move = moves.find((move) => move.square === square) as PawnMove;

        if (move?.isPromotion) {
          // Defer the move until promotion piece is selected
          setPendingPromotion({
            from: fromSquare,
            to: square,
            color: move.color,
          });
          setPromotionSquare(square);
          return; // Exit without moving the piece yet
        }
      }

      playMoveSound();

      socket.emit("move-piece", roomId, fromSquare, square);

      // Clone the board to avoid direct state mutation
      const newBoard = board.cloneBoard();
      newBoard.movePiece(
        fromSquare,
        square,
        new Player(piece.getColor(), true)
      );

      // Update state
      setBoard(newBoard);
      setFromSquare(null);
      setAvailableMoves([]);
      setDetailedAvailableMoves([]);
      setTurn(turn === "white" ? "black" : "white");

      // Check for game over conditions
      checkGameStatus(newBoard);
    }
  };
  const confirmPromotion = (
    promotionPiece: "queen" | "rook" | "bishop" | "knight"
  ) => {
    if (!pendingPromotion || !socket) return;

    const { from, to, color } = pendingPromotion;

    // Clone the board
    const newBoard = board.cloneBoard();

    // Perform the move with the selected promotion piece
    newBoard.movePiece(from, to, new Player(color, true), promotionPiece);

    // Emit the move to the server, including the promotion piece
    socket.emit("move-piece", roomId, from, to, promotionPiece);

    // Update state
    setBoard(newBoard);
    setFromSquare(null);
    setAvailableMoves([]);
    setDetailedAvailableMoves([]);
    setTurn(turn === "white" ? "black" : "white");
    setPendingPromotion(null);
    setPromotionSquare(null);

    // Check game status
    checkGameStatus(newBoard);

    // Play move sound
    playMoveSound();
  };

  return {
    board,
    turn,
    gameOver,
    gameResult,
    availableMoves,
    detailedAvailableMoves,
    fromSquare,
    selectSquare,
    movePiece,
    promotionSquare,
    pendingPromotion,
    confirmPromotion,
  };
};

export default useChessGameState;
