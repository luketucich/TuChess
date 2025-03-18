import React, { useState, useEffect, useRef } from "react";
import { Zap, User, Settings } from "react-feather";
import "../styles/Header.css";

const Header: React.FC = () => {
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const prevScrollPos = useRef<number>(window.scrollY);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const accountContainerRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll to hide/show header
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

  // Handle clicks outside to close the menu
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

  return (
    <header
      className={`header ${visible ? "" : "header-hidden"} ${
        isHovered ? "header-expanded" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="header-left">
        <Zap className="logo-icon" />
        <h1 className="site-title">TuChess</h1>
      </div>

      <div className="header-right">
        <div
          ref={accountContainerRef}
          className="account-container"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
        >
          <button className="account-button">
            <User className="account-icon" />
            <span className="account-text">Guest</span>
          </button>

          {showAccountMenu && (
            <div ref={accountMenuRef} className="account-menu">
              <button className="menu-item">
                <User className="menu-icon" />
                <span>Sign In</span>
              </button>
              <button className="menu-item">
                <Settings className="menu-icon" />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
