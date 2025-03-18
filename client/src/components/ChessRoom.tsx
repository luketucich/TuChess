import { useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { io, Socket } from "socket.io-client";
import ChessBoard from "./ChessBoard";
import "../styles/Styles.css";
import "../styles/ChessRoom.css";
import QueueGrid from "./QueueGrid";
import Timer from "./Timer";

function ChessRoom() {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("Anonymous");
  const [opponentUsername, setOpponentUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [rooms, setRooms] = useState<
    {
      roomId: string;
      users: { id: string; username?: string; color?: string }[];
    }[]
  >([]);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const joinAudioRef = useRef(new Audio("/assets/join_room.mp3"));

  const playJoinSound = () => {
    joinAudioRef.current.currentTime = 0;
    joinAudioRef.current
      .play()
      .catch((err) => console.error("Error playing audio:", err));
  };

  // Socket connection setup
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("rooms-update", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    socketRef.current.on(
      "send-username",
      (opponentUsername: string, opponentId: string) => {
        if (socketRef.current?.id !== opponentId) {
          setOpponentUsername(opponentUsername);
        }
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Handle starting game when room is full
  useEffect(() => {
    if (isInRoom && isRoomFull(roomId)) {
      handleStartGame(roomId);
      playJoinSound();
    }
  }, [isInRoom, rooms, roomId]);

  const isRoomFull = (roomId: string) => {
    const room = rooms.find((room) => room.roomId === roomId);
    return room?.users?.length === 2;
  };

  const fetchPlayerInfo = (roomId: string) => {
    const room = rooms.find((room) => room.roomId === roomId);
    const playerInfo = room?.users?.find(
      (user) => user.id === socketRef.current?.id
    );

    return playerInfo;
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (socketRef.current) {
      // Send join request without pre-assigning color
      socketRef.current.emit("join-room", roomId, username);
    }
    setIsInRoom(true);
  };

  const handleStartGame = (roomId: string) => {
    socketRef.current?.emit("start-game", roomId);
  };

  return (
    <div className="chess-room-container">
      {!isInRoom ? (
        <>
          <QueueGrid />
          <form onSubmit={handleJoinRoom}>
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
        </>
      ) : (
        <div className="game-container">
          {!isRoomFull(roomId) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: "colorWave 2s infinite, slowFadeIn 0.5s linear",
                maxWidth: "80%",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "var(--primary-color)",
                  marginBottom: "1rem",
                  textAlign: "center",
                  textWrap: "wrap",
                }}
              >
                Waiting for another player to join
              </h2>
              <img
                src="/assets/logo.svg"
                color="var(--primary-color)"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  animation: "spin 2s linear infinite",
                }}
              />
            </div>
          ) : (
            <div className="game-board-container">
              {fetchPlayerInfo(roomId)?.color && (
                <ChessBoard
                  playerColor={fetchPlayerInfo(roomId)?.color as string}
                  socket={socketRef.current as Socket}
                  roomId={roomId}
                  name={username}
                  opponentName={opponentUsername}
                  connected={isConnected}
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
