import { BarChart } from "react-feather";
import "../styles/PlayerCard.css";

const PlayerCard = ({
  name,
  connected,
  orientation,
}: {
  name: string;
  connected: boolean;
  orientation: string;
}) => {
  return (
    <div
      className="player-card"
      style={{
        justifyContent: orientation === "left" ? "flex-start" : "flex-end",
      }}
    >
      <div className="player-card-info-container">
        <BarChart
          className={`player-card-status-icon ${
            connected ? "connected" : "disconnected"
          }`}
        />
        <h3 className="player-card-name">{name}</h3>
      </div>
    </div>
  );
};

export default PlayerCard;
