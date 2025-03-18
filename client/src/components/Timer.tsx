import { Socket } from "socket.io-client";
import "../styles/PlayerCard.css";
import { useState, useEffect, useRef } from "react";

const Timer = ({
  time,
  increment,
  socket,
}: {
  time: number;
  increment: number;
  socket: Socket;
}) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const [isTurn, setIsTurn] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    // Handle turn changes
    if (!isTurn) {
      // Add increment when turn ends
      setTimeLeft((prevTime) => prevTime + increment);
    } else if (isTurn && timeLeft > 0) {
      // Start the timer when it's the player's turn
      timerRef.current = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time ran out
      socket.emit("timeOut");
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTurn, increment, socket]);

  return (
    <div className="player-card">
      <div className="player-card-info-container">
        <h3 className="player-card-name">{formatTime(timeLeft)}</h3>
      </div>

      <button onClick={() => setIsTurn((prevIsTurn) => !prevIsTurn)}>
        click me
      </button>
    </div>
  );
};

export default Timer;
