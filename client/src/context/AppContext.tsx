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
}

const defaultContext: AppContextType = {
  socket: null,
  isConnected: false,
  user: null,
  signIn: () => {},
  signOut: () => {},
  errorMessage: "",
  setErrorMessage: () => {},
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
      setUser(
        data.user
          ? {
              email: data.user.email || "",
              id: data.user.id,
            }
          : null
      );
    };

    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(
            session?.user
              ? { email: session.user.email || "", id: session.user.id }
              : null
          );
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
