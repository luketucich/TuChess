import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../config/env";
import { Game, User } from "../models/interfaces";

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function saveGameToSupabase(
  roomId: string,
  game: Game,
  users: User[]
) {
  const whitePlayer = users.find((u) => u.color === "white");
  const blackPlayer = users.find((u) => u.color === "black");

  const gameData = {
    room_id: roomId,
    white_player_socket_id: whitePlayer?.id,
    white_player_supabase_id: whitePlayer?.authId,
    black_player_socket_id: blackPlayer?.id,
    black_player_supabase_id: blackPlayer?.authId,
    game_state: game.serializedBoard,
    turn: game.turn,
    is_completed: game.gameOver,
    time_control: game.timeControl,
  };

  const { data, error } = await supabase
    .from("chess_games")
    .upsert([gameData], { onConflict: "room_id" });

  if (error) {
    console.error("Upsert error:", error.message);
    throw error;
  }

  return data;
}
