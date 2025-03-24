import { BarChart } from "react-feather";
import { useAppContext } from "../context/AppContext";
import "../styles/PlayerCard.css";
import { useState, useEffect } from "react";

const PlayerCard = ({
  name,
  playerColor,
}: {
  name: string;
  playerColor: string;
}) => {
  const { socket } = useAppContext();
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  // When opponent connection status changes, update the UI
  useEffect(() => {
    socket?.on(
      "set-status-offline",
      (updateStatusPlayerColor: "white" | "black") => {
        if (playerColor === updateStatusPlayerColor) {
          setShowOnlineStatus(false);
        }
      }
    );

    socket?.on(
      "set-status-online",
      (updateStatusPlayerColor: "white" | "black") => {
        if (playerColor === updateStatusPlayerColor) {
          setShowOnlineStatus(true);
        }
      }
    );

    // Clean up event listeners when component unmounts
    return () => {
      socket?.off("set-status-offline");
      socket?.off("set-status-online");
    };
  }, [playerColor, socket]);

  return (
    <div className="player-card">
      <div className="player-card-info-container">
        <BarChart
          className={`player-card-status-icon ${
            showOnlineStatus ? "connected" : "disconnected"
          }`}
        />
        <h3 className="player-card-name">{name}</h3>
      </div>
    </div>
  );
};

export default PlayerCard;
