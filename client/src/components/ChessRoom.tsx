import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ChessBoard from "./ChessBoard";

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

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

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
    <div>
      <h1>Welcome to TuChess</h1>
      <span className={isConnected ? "connected" : "disconnected"}>
        Your Status:
        {isConnected ? " Connected" : " Disconnected"}
      </span>
      {!isInRoom ? (
        <>
          <h2>Join a Room</h2>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Enter a username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter a room ID"
              onChange={(e) => setRoomId(e.target.value)}
              minLength={4}
              required
            />
            <button type="submit">Join Room</button>
          </form>

          <h2>Current Rooms</h2>
          <div className="rooms-list">
            {rooms.length > 0 ? (
              <ul>
                {rooms.map((room) => (
                  <li key={room.roomId}>
                    <strong>Room: {room.roomId}</strong>
                    <ul>
                      {room.players.map((player) => (
                        <li key={player.id}>
                          {player.username || "Anonymous"}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active rooms</p>
            )}
          </div>
        </>
      ) : (
        <>
          {!isRoomFull(roomId) ? (
            <>
              <p>You are playing as {fetchPlayerInfo(roomId)?.color}</p>
              <p>Waiting for another player to join...</p>
            </>
          ) : (
            <>
              {fetchPlayerInfo(roomId)?.color && (
                <ChessBoard
                  playerColor={fetchPlayerInfo(roomId)?.color as string}
                  socket={socketRef.current as Socket}
                  roomId={roomId}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ChessRoom;
