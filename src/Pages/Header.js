import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import "./Header.css";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { useKeycloak } from '@react-keycloak/web';

const Header = ({ title, onBack }) => {
  const location = useLocation();
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const { keycloak } = useKeycloak();
  const dropdownRef = useRef(null);
  
  const pageNames = {
    "/calling-team": "Calling Team",
    "/executive-team": "Executive Team",
    "/backend-team": "Backend Team",
    "/dashboard": "Management System",
    "/account-team": "Account Team",
    "/marketing-team": "Marketing Team",
    "/clients": "Client",
    "/client-edit": "Client Edit Page",
    "/add-lead": "Add Lead",
    "/edit": "Edit Lead"
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const getInitials = () => {
    const firstInitial = user?.firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = user?.lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  const pageName = title ?? (pageNames[location.pathname] || "Management System");
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="header">
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {onBack && <button onClick={onBack} className="back-button">Back</button>}
        <h1 style={{ margin: 0 }}>{title ?? pageName}</h1>
      </div>

      <div className="user-info-container" ref={dropdownRef}>
        <div className="user-info" onClick={toggleMenu}>
          <h5 className="user-greeting">
            Hi, {user.firstName} {user.lastName}
          </h5>
          <div className="user-avatar">
            {getInitials()}
          </div>
        </div>

        {menuOpen && (
          <>
            <div className="dropdown-backdrop" onClick={() => setMenuOpen(false)}></div>
            <div className="user-dropdown">
              <div className="dropdown-top">
                <div className="dropdown-initials">{getInitials()}</div>
                <div className="dropdown-name">
                  {user.firstName} {user.lastName}
                </div>
              </div>
              <button className="logout-button" onClick={logout}>
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
