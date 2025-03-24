import React, { useState, useEffect, useRef } from "react";
import { User, LogOut, Settings } from "react-feather";
import "../styles/Header.css";
import { useAppContext } from "../context/AppContext";
import GoogleSignIn from "./GoogleSignIn";

const Header: React.FC = () => {
  // Context and state
  const { user, signOut, errorMessage } = useAppContext();
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Refs
  const prevScrollPos = useRef<number>(window.scrollY);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const accountContainerRef = useRef<HTMLDivElement | null>(null);

  // Header visibility control based on scroll direction
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

  // Outside click detection to close account menu
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

  const handleLogout = async () => {
    await signOut();
    setShowAccountMenu(false);
  };

  return (
    <>
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

        <div className="header-right">
          {user ? (
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
          ) : (
            <GoogleSignIn />
          )}
        </div>
      </header>

      {errorMessage && (
        <div
          className="error-banner"
          style={{
            backgroundColor: "rgba(255, 221, 221, 0.9)",
            color: "#d63031",
            padding: "10px 15px",
            textAlign: "center",
            width: "100%",
            position: "fixed",
            top: visible ? "60px" : "0",
            zIndex: 99,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "top 0.3s ease",
          }}
        >
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default Header;
