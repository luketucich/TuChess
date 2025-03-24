import "../styles/PlayerCard.css";
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";

const Timer = ({
  time,
  increment,
  isTurn,
  roomId,
  playerColor,
  gameOver,
  receivedGameState,
}: {
  time: number;
  increment: number;
  isTurn: boolean;
  roomId: string;
  playerColor: string;
  gameOver: boolean;
  receivedGameState: {
    serializedBoard: string;
    turn: "white" | "black";
    gameOver: boolean;
    whiteTime: number;
    blackTime: number;
    increment: number;
  } | null;
}) => {
  const { socket } = useAppContext();

  const [timeLeft, setTimeLeft] = useState(time);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevTurnRef = useRef(isTurn);

  // Formats time in seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Set time from received game state when reconnecting
  useEffect(() => {
    if (receivedGameState) {
      if (
        playerColor === "white" &&
        receivedGameState.whiteTime !== undefined
      ) {
        console.log(
          "Setting time for white player:",
          receivedGameState.whiteTime
        );
        setTimeLeft(receivedGameState.whiteTime);
      } else if (
        playerColor === "black" &&
        receivedGameState.blackTime !== undefined
      ) {
        console.log(
          "Setting time for black player:",
          receivedGameState.blackTime
        );
        setTimeLeft(receivedGameState.blackTime);
      }
    }
  }, [receivedGameState, playerColor]);

  // If game state is not received, set time to initial time
  useEffect(() => {
    if (!receivedGameState) {
      setTimeLeft(time);
    }
  }, [time, receivedGameState]);

  // Sync time with server
  useEffect(() => {
    socket?.on("sync-time", (serverTime: number, color: string) => {
      if (color === playerColor) {
        if (serverTime <= 0) {
          socket.emit("timeout", roomId, playerColor);
          return;
        }

        setTimeLeft(serverTime);
        console.log("Synced time with server:", serverTime);
      }
    });

    return () => {
      socket?.off("send-game-state");
      socket?.off("sync-time");
    };
  }, [socket, playerColor, roomId]);

  // Handle turn changes and timer logic
  useEffect(() => {
    // Add increment when player's turn ends
    if (prevTurnRef.current && !isTurn) {
      setTimeLeft((prevTime) => prevTime + increment);
    }

    prevTurnRef.current = isTurn;

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start countdown if it's player's turn and game is active
    if (isTurn && timeLeft > 0 && !gameOver && socket) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime <= 0) {
            // Stop the timer
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }

            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTurn, increment, socket, timeLeft, roomId, playerColor, gameOver]);

  return (
    <div className="player-card">
      <div className="player-card-info-container">
        <h3
          className={`player-card-name ${isTurn ? "active-timer" : ""} ${
            timeLeft <= 10 ? "low-time" : ""
          }`}
        >
          {formatTime(timeLeft)}
        </h3>
      </div>
    </div>
  );
};

export default Timer;
