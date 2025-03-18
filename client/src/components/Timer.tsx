import { Socket } from "socket.io-client";
import "../styles/PlayerCard.css";
import { useState, useEffect, useRef } from "react";

const Timer = ({
  time,
  increment,
  socket,
  isTurn,
  roomId,
  playerColor,
  gameOver,
}: {
  time: number;
  increment: number;
  socket: Socket;
  isTurn: boolean;
  roomId: string;
  playerColor: string;
  gameOver: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevTurnRef = useRef(isTurn);

  // Format time as minutes:seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Reset the timer when a new game starts
  useEffect(() => {
    setTimeLeft(time);
  }, [time]);

  // Watch for turn changes and update the timer accordingly
  useEffect(() => {
    // Check if turn just ended - only then add the increment
    if (prevTurnRef.current && !isTurn) {
      setTimeLeft((prevTime) => prevTime + increment);
    }

    // Update the previous turn reference
    prevTurnRef.current = isTurn;

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // If it's this player's turn, start counting down
    if (isTurn && timeLeft > 0 && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            // Time's up - clear the interval to prevent multiple emissions
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            // Emit the timeout event with required information
            socket.emit("timeout", roomId, playerColor);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTurn, increment, socket, timeLeft, roomId, playerColor]);

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
