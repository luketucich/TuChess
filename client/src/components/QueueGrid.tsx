import { FC } from "react";
import "../styles/QueueGrid.css";
import { Plus, LogIn } from "react-feather";
import { Socket } from "socket.io-client";

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

interface QueueGridProps {
  socket: Socket | null;
  setIsInRoom: (isInRoom: boolean) => void;
  setRoomId: (roomId: string) => void;
  setUsername: (username: string) => void;
  defaultUsername?: string;
  rooms: {
    roomId: string;
    users: { id: string; username?: string; color?: string }[];
  }[];
  setTimeControl: (timeControl: { time: number; increment: number }) => void;
}

const QueueGrid: FC<QueueGridProps> = ({
  socket,
  setIsInRoom,
  setRoomId,
  setUsername,
  defaultUsername = "Anonymous",
  rooms,
  setTimeControl,
}) => {
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

  const retrieveTimeControlRoomCode = (
    category: string,
    time: number,
    increment: number
  ): string => {
    // Check if there's an existing room for this time control that needs another player
    const existingRoom = rooms.find((room) => {
      return (
        room.roomId.startsWith(`${category}-${time}-${increment}`) &&
        room.users.length === 1
      );
    });

    // If there's an existing room with one player, return that room ID
    if (existingRoom) {
      return existingRoom.roomId;
    }

    // Otherwise, generate a random room code
    const generatedRoomCode = `${category}-${time}-${increment}-${Math.floor(
      Math.random() * 1000
    )}`;

    return generatedRoomCode;
  };

  const handleJoinRoom = () => {
    // const roomCode = prompt("Enter the room code:");
    // if (!roomCode) return;

    // const enteredUsername = prompt("Enter your username:", defaultUsername);
    // if (!enteredUsername) return;

    // // Update parent component state
    // setRoomId(roomCode);
    // setUsername(enteredUsername);

    // // Emit join event to socket server
    // if (socket) {
    //   socket.emit("join-room", roomCode, enteredUsername);
    //   setIsInRoom(true);
    // }
    alert("Coming soon!");
  };

  const handleCreateRoom = () => {
    // const roomCode = prompt("Create a room code:");
    // if (!roomCode) return;

    // // Ask user to specify time control for custom game
    // const timeControlInput = prompt(
    //   "Enter time control (minutes + increment):",
    //   "5+0"
    // );

    // if (!timeControlInput) return;
    // const timeControl = timeControlInput.split("+");

    // const enteredUsername = prompt("Enter your username:", defaultUsername);
    // if (!enteredUsername) return;

    // // Update parent component state
    // setRoomId(roomCode);
    // setUsername(enteredUsername);
    // setTimeControl({
    //   time: parseInt(timeControl[0]),
    //   increment: parseInt(timeControl[1]),
    // });

    // // Emit join event to socket server
    // if (socket) {
    //   socket.emit("join-room", roomCode, enteredUsername);
    //   setIsInRoom(true);
    // }
    alert("Coming soon!");
  };

  const handleTimeControlClick = (
    category: string,
    time: number,
    increment: number
  ) => {
    const generatedRoomCode = retrieveTimeControlRoomCode(
      category,
      time,
      increment
    );
    const enteredUsername = prompt("Enter your username:", defaultUsername);
    if (!enteredUsername) return;

    // Update parent component state
    setRoomId(generatedRoomCode);
    setUsername(enteredUsername);
    setTimeControl({ time, increment });

    // Emit join event to socket server
    if (socket) {
      socket.emit("join-room", generatedRoomCode, enteredUsername);
      setIsInRoom(true);
    }
  };

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
            onClick={() =>
              handleTimeControlClick(
                title.toLowerCase(),
                control.time,
                control.increment
              )
            }
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
        <button className="custom-game-button" onClick={handleCreateRoom}>
          <Plus
            size={18}
            color="var(--primary-color)"
            className="button-icon"
          />
          Custom Game
        </button>
        <button className="custom-game-button" onClick={handleJoinRoom}>
          <LogIn
            size={18}
            color="var(--primary-color)"
            className="button-icon"
          />
          Room Code
        </button>
      </div>
    </div>
  );
};

export default QueueGrid;
