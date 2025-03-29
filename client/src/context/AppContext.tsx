import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { supabase } from "./Supabase";

type User = {
  email: string;
  id?: string;
} | null;

interface AppContextType {
  socket: Socket | null;
  isConnected: boolean;
  user: User;
  signIn: () => void;
  signOut: () => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  boardTheme?: string;
  setBoardTheme?: (theme: string) => void;
}

const defaultContext: AppContextType = {
  socket: null,
  isConnected: false,
  user: null,
  signIn: () => {},
  signOut: () => {},
  errorMessage: "",
  setErrorMessage: () => {},
  boardTheme: "",
  setBoardTheme: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [boardTheme, setBoardTheme] = useState("");

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io("https://tuchess-1.onrender.com");
    // const socketInstance = io("http://localhost:3001");

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Track authentication state
  useEffect(() => {
    // Get initial auth state
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user
        ? {
            email: data.user.email || "",
            id: data.user.id,
          }
        : null;

      setUser(user);

      // Fetch user preferences if logged in
      if (user?.id) {
        fetchUserPreferences(user.id);
      }
    };

    // Function to fetch user preferences
    const fetchUserPreferences = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("board_theme")
          .eq("user_id", userId)
          .single();

        if (error) {
          console.error("Error fetching user preferences:", error);
          return;
        }

        if (data?.board_theme !== null) {
          setBoardTheme(data.board_theme);
        }
      } catch (err) {
        console.error("Error fetching user preferences:", err);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const user = session?.user
            ? { email: session.user.email || "", id: session.user.id }
            : null;

          setUser(user);

          // Fetch preferences when user signs in
          if (user?.id) {
            fetchUserPreferences(user.id);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Authenticate with the server when user or socket changes
  useEffect(() => {
    if (user && socket) {
      socket.emit("authenticate", user.id);
    }
  }, [user, socket]);

  // Update user theme preference
  useEffect(() => {
    const updateBoardTheme = async () => {
      if (!user?.id) return;

      try {
        // Update database with new board theme
        const { error } = await supabase
          .from("user_preferences")
          .upsert({
            user_id: user.id,
            board_theme: boardTheme,
          })
          .select();

        if (error) {
          console.error("Error updating board theme:", error);
          return;
        }

        // Update root variables based on board theme
        switch (boardTheme) {
          // Mocha
          case "mocha":
            document.documentElement.style.setProperty(
              "--white-square-color",
              "#E5D5C5"
            );
            document.documentElement.style.setProperty(
              "--black-square-color",
              "#9A8070"
            );
            break;

          // Blueberry
          case "blueberry":
            document.documentElement.style.setProperty(
              "--white-square-color",
              "#C0D0DA"
            );
            document.documentElement.style.setProperty(
              "--black-square-color",
              "#6A7A8A"
            );
            break;

          // Pistachio
          case "pistachio":
            document.documentElement.style.setProperty(
              "--white-square-color",
              "#E0EBCF"
            );
            document.documentElement.style.setProperty(
              "--black-square-color",
              "#A5B28C"
            );
            break;
          // Sakura
          case "sakura":
            document.documentElement.style.setProperty(
              "--white-square-color",
              "#FFE0ED"
            );
            document.documentElement.style.setProperty(
              "--black-square-color",
              "#D5A0B0"
            );
            break;
          default:
            document.documentElement.style.setProperty(
              "--white-square-color",
              "#E5D5C5"
            );
            document.documentElement.style.setProperty(
              "--black-square-color",
              "#9A8070"
            );
        }
      } catch (err) {
        console.error("Unexpected error updating board theme:", err);
      }
    };

    if (boardTheme) {
      updateBoardTheme();
    }
  }, [boardTheme, user?.id]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider
      value={{
        socket,
        isConnected,
        user,
        errorMessage,
        signIn,
        signOut,
        setErrorMessage,
        boardTheme,
        setBoardTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
