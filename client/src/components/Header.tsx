import React, { useState, useEffect, useRef } from "react";
import { User, LogOut, Settings } from "react-feather";
import "../styles/Header.css";
import GoogleSignIn from "./GoogleSignIn";
import { supabase } from "../hooks/supabase";

type UserType = {
  email: string;
  id?: string;
} | null;

const Header: React.FC = () => {
  const [user, setUser] = useState<UserType>(null);
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const prevScrollPos = useRef<number>(window.scrollY);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const accountContainerRef = useRef<HTMLDivElement | null>(null);

  // Hide/show header on scroll
  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollPos = window.scrollY;
      setVisible(
        prevScrollPos.current > currentScrollPos || currentScrollPos < 10
      );
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        accountMenuRef.current &&
        accountContainerRef.current &&
        !accountMenuRef.current.contains(event.target as Node) &&
        !accountContainerRef.current.contains(event.target as Node)
      ) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track authentication state
  useEffect(() => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAccountMenu(false);
  };

  return (
    <header
      className={`header ${visible ? "" : "header-hidden"} ${
        isHovered ? "header-expanded" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="header-left">
        <h1 className="site-title">TuChess</h1>
      </div>

      {user ? (
        <div className="header-right">
          <div
            ref={accountContainerRef}
            className="account-container"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
          >
            <button className="account-button">
              <User className="account-icon" />
              <span className="account-text">
                Hi, {user.email.split("@gmail.com")[0]}!
              </span>
            </button>

            {showAccountMenu && user && (
              <div ref={accountMenuRef} className="account-menu">
                <>
                  <button className="menu-item" onClick={handleLogout}>
                    <LogOut className="menu-icon" />
                    Log out
                  </button>
                  <button className="menu-item">
                    <Settings className="menu-icon" />
                    <span>Settings</span>
                  </button>
                </>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="header-right">
          <GoogleSignIn />
        </div>
      )}
    </header>
  );
};

export default Header;
