import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const SUPABASE_URL = process.env.SUPABASE_URL as string;
export const SUPABASE_KEY = process.env.SUPABASE_KEY as string;
export const DEBUG_LEVEL = process.env.DEBUG_LEVEL;
