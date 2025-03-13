import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ChessBoard from "./ChessBoard";
import "../styles/ChessRoom.css";

function ChessRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("Anonymous");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState<
    {
      roomId: string;
      players: { id: string; username?: string; color: string }[];
    }[]
  >([]);
  const socketRef = useRef<Socket | null>(null);
  const [isInRoom, setIsInRoom] = useState(false);
  const joinAudioRef = useRef(new Audio("/assets/join_room.mp3"));

  const playJoinSound = () => {
    joinAudioRef.current.currentTime = 0; // Reset audio to start
    joinAudioRef.current
      .play()
      .catch((err) => console.error("Error playing audio:", err));
  };

  useEffect(() => {
    socketRef.current = io("https://tuchess-1.onrender.com");
    // socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for room updates
    socketRef.current.on("rooms-update", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isInRoom && isRoomFull(roomId)) {
      handleStartGame(roomId);
      playJoinSound();
    }
  }, [isInRoom, rooms, roomId]);

  const isRoomFull = (roomId: string) => {
    const room = rooms.find((room) => room.roomId === roomId);
    return room?.players.length === 2;
  };

  const fetchPlayerInfo = (roomId: string) => {
    const room = rooms.find((room) => room.roomId === roomId);
    return room?.players.find((player) => player.id === socketRef.current?.id);
  };

  const assignPlayerColor = () => {
    const room = rooms.find((room) => room.roomId === roomId);
    if (room) {
      return room.players[0].color === "white" ? "black" : "white";
    }
    return Math.random() > 0.5 ? "white" : "black";
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    const playerColor = assignPlayerColor();

    if (socketRef.current) {
      socketRef.current.emit("join-room", roomId, username, playerColor);
    }

    setIsInRoom(true);
  };

  const handleStartGame = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("start-game", roomId);
    }
  };

  return (
    <div className="chess-app">
      <h1 className="app-title">Welcome to TuChess</h1>
      <span
        className={`status-indicator ${
          isConnected ? "connected" : "disconnected"
        }`}
      >
        Your Status:
        {isConnected ? " Connected" : " Disconnected"}
      </span>
      {!isInRoom ? (
        <div className="lobby-container">
          <h2 className="section-title">Join a Room</h2>
          <form className="join-form" onSubmit={handleJoinRoom}>
            <input
              className="input-field"
              type="text"
              placeholder="Enter a username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Enter a room ID"
              onChange={(e) => setRoomId(e.target.value)}
              minLength={4}
              required
            />
            <button className="btn btn-primary" type="submit">
              Join Room
            </button>
          </form>

          <h2 className="section-title">Current Rooms</h2>
          <div className="rooms-list">
            {rooms.length > 0 ? (
              <ul className="room-items">
                {rooms.map((room) => (
                  <li className="room-item" key={room.roomId}>
                    <strong className="room-id">Room: {room.roomId}</strong>
                    <ul className="player-list">
                      {room.players.map((player) => (
                        <li className="player-item" key={player.id}>
                          {player.username || "Anonymous"}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-rooms">No active rooms</p>
            )}
          </div>
        </div>
      ) : (
        <div className="game-container">
          {!isRoomFull(roomId) ? (
            <div className="waiting-room">
              <p className="player-info">
                You are playing as {fetchPlayerInfo(roomId)?.color}
              </p>
              <p className="waiting-message">
                Waiting for another player to join...
              </p>
            </div>
          ) : (
            <div className="game-board-container">
              {fetchPlayerInfo(roomId)?.color && (
                <ChessBoard
                  playerColor={fetchPlayerInfo(roomId)?.color as string}
                  socket={socketRef.current as Socket}
                  roomId={roomId}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChessRoom;
