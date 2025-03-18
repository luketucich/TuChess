import { FC } from "react";
import "../styles/QueueGrid.css";

interface TimeControl {
  time: number;
  increment: number;
}

interface TimeControls {
  bullet: TimeControl[];
  blitz: TimeControl[];
  rapid: TimeControl[];
  classical: TimeControl[];
}

const QueueGrid: FC = () => {
  const timeControls: TimeControls = {
    bullet: [
      { time: 1, increment: 0 },
      { time: 1, increment: 1 },
      { time: 2, increment: 0 },
    ],
    blitz: [
      { time: 3, increment: 0 },
      { time: 3, increment: 2 },
      { time: 5, increment: 0 },
    ],
    rapid: [
      { time: 10, increment: 0 },
      { time: 10, increment: 5 },
      { time: 15, increment: 10 },
    ],
    classical: [
      { time: 30, increment: 0 },
      { time: 30, increment: 20 },
      { time: 60, increment: 30 },
    ],
  };

  const formatTimeControl = (time: number, increment: number): string =>
    `${time} + ${increment}`;

  const renderTimeControlSection = (title: string, controls: TimeControl[]) => (
    <div className="queue-section">
      <div className="section-header">
        <img
          src={`/assets/${title.toLowerCase()}.svg`}
          alt={`${title} icon`}
          className="section-icon"
          color="white"
        />
        <h2>{title}</h2>
      </div>
      <div className="time-options">
        {controls.map((control, index) => (
          <button
            key={`${title.toLowerCase()}-${index}`}
            className="time-option"
          >
            <span className="time-display">
              {formatTimeControl(control.time, control.increment)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="queue-grid-container">
      <div className="queue-grid">
        {renderTimeControlSection("Bullet", timeControls.bullet)}
        {renderTimeControlSection("Blitz", timeControls.blitz)}
        {renderTimeControlSection("Rapid", timeControls.rapid)}
        {renderTimeControlSection("Classical", timeControls.classical)}
      </div>

      <div className="custom-game-container">
        <button className="custom-game-button">
          <span>Custom</span>
        </button>
      </div>
    </div>
  );
};

export default QueueGrid;
