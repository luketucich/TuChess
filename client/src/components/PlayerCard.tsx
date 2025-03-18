import { BarChart } from "react-feather";
import "../styles/PlayerCard.css";

const PlayerCard = ({
  name,
  connected,
}: {
  name: string;
  connected: boolean;
}) => {
  return (
    <div className="player-card">
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
