import { usePointerTracking } from "../hooks/usePointerTracking.tsx";
import useChessGameState from "../hooks/useChessGameState.tsx";
import { Socket } from "socket.io-client";
import "../styles/ChessBoard.css";
import PlayerCard from "./PlayerCard.tsx";
import Timer from "./Timer.tsx";
import PieceDisplay from "./PieceDisplay.tsx";

const ChessBoard = ({
  playerColor,
  socket,
  roomId,
  name,
  opponentName,
  connected,
  timeControl,
}: {
  playerColor: string;
  socket: Socket;
  roomId: string;
  name: string;
  opponentName: string;
  connected: boolean;
  timeControl: { time: number; increment: number };
}) => {
  const {
    board,
    turn,
    gameOver,
    gameResult,
    availableMoves,
    detailedAvailableMoves,
    fromSquare,
    selectSquare,
    movePiece,
  } = useChessGameState(playerColor, socket, roomId);

  const pointerState = usePointerTracking(movePiece);

  const getBoard = (playerColor: string) => {
    if (playerColor === "black") {
      // Reverse both rows and columns for a proper 180° rotation
      return board
        .getBoard()
        .slice()
        .reverse()
        .map((row) => row.slice().reverse());
    }
    return board.getBoard();
  };

  const isLastMove = (square: string) => {
    const lastMove = board.getHistory()[board.getHistory().length - 1];
    if (!lastMove) return false;

    return (
      lastMove.getFrom()?.getPosition() === square ||
      lastMove.getMove()?.square === square
    );
  };

  const isInCheck = () => {
    const lastMove = board.getHistory()[board.getHistory().length - 1];
    return lastMove?.getMove().isCheck;
  };

  return (
    <div className="chessboard-container">
      <div className="player-card-left">
        <PlayerCard name={opponentName} connected={connected} />
        <Timer
          time={timeControl.time * 60}
          increment={timeControl.increment}
          socket={socket}
          isTurn={turn !== playerColor}
          roomId={roomId}
          playerColor={playerColor === "white" ? "black" : "white"}
          gameOver={gameOver}
        />
        <PieceDisplay
          socket={socket}
          playerColor={playerColor === "white" ? "black" : "white"}
        />
      </div>

      <div className="chessboard">
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-message">
              <h2>Game Over</h2>
              <p>{gameResult}</p>
            </div>
          </div>
        )}

        {getBoard(playerColor).flatMap((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square =
              playerColor === "black"
                ? board.indexToSquare([7 - rowIndex, 7 - colIndex])
                : board.indexToSquare([rowIndex, colIndex]);
            const isBlack = (rowIndex + colIndex) % 2 === 1;

            // Determine square style based on game state
            const squareStyle = isLastMove(square)
              ? {
                  boxShadow: "inset 0 0 100rem rgba(255, 183, 0, 0.6)",
                  transition: "background-color 0.2s ease-in-out",
                }
              : isInCheck() &&
                piece?.getColor() === turn &&
                piece?.getName?.() === "king"
              ? {
                  boxShadow: "inset 0 0 100rem rgba(255, 0, 0, 0.6)",
                  transition: "background-color 0.2s ease-in-out",
                }
              : {};

            // Find if current move is a capture
            const isCapture = detailedAvailableMoves.find(
              (move) => move.square === square
            )?.isCapture;

            return (
              <div
                key={square}
                data-square={square}
                className={`square ${isBlack ? "black" : "white"} ${
                  availableMoves.includes(square) && !pointerState.isDown
                    ? "available-move"
                    : ""
                } ${pointerState.isDown ? "grabbing" : ""}`}
                onPointerDown={
                  !fromSquare && !gameOver
                    ? () => selectSquare(square)
                    : () => movePiece(square)
                }
                onPointerEnter={(e) => {
                  if (gameOver) return;
                  const indicator = e.currentTarget.querySelector(
                    ".indicator"
                  ) as HTMLElement | null;
                  if (indicator) {
                    indicator.classList.add("hover");
                    e.currentTarget.style.filter = "brightness(1.1)";
                  }
                }}
                onPointerLeave={(e) => {
                  const indicator = e.currentTarget.querySelector(
                    ".indicator"
                  ) as HTMLElement | null;
                  if (indicator) {
                    indicator.classList.remove("hover");
                  }
                  e.currentTarget.style.filter = "none";
                }}
                onPointerUp={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
                style={squareStyle}
              >
                {/* Move indicators */}
                {availableMoves.includes(square) && !gameOver && (
                  <div
                    className={`indicator ${isCapture ? "capture" : "move"}`}
                  ></div>
                )}

                {piece && (
                  <div
                    className={`piece ${
                      pointerState.isDown && fromSquare === square && !gameOver
                        ? "dragging"
                        : ""
                    }`}
                    style={
                      pointerState.isDown && fromSquare === square && !gameOver
                        ? {
                            left: `${pointerState.position.x - 25}px`,
                            top: `${pointerState.position.y - 25}px`,
                          }
                        : {}
                    }
                  >
                    <img
                      src={`/assets/${piece.getColor()[0]}${piece
                        .getName()[0]
                        .toUpperCase()}${piece.getName()[1]}.svg`}
                      alt={`${piece.getColor()} ${piece.getName()}`}
                      width="50"
                      height="50"
                      draggable="false"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="player-card-right">
        <PlayerCard name={name} connected={connected} />
        <Timer
          time={timeControl.time * 60}
          increment={timeControl.increment}
          socket={socket}
          isTurn={turn === playerColor}
          roomId={roomId}
          playerColor={playerColor}
          gameOver={gameOver}
        />
        <PieceDisplay socket={socket} playerColor={playerColor} />
      </div>
    </div>
  );
};

export default ChessBoard;
