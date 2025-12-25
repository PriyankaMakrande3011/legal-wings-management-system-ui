import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import "./Header.css";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { useKeycloak } from "@react-keycloak/web";

const Header = ({ title, onBack }) => {
  const location = useLocation();
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
 const { keycloak } = useKeycloak();
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

  const getInitials = () => {
    const firstInitial = user?.firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = user?.lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  const styles = {
    avatar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "5px",
      backgroundColor: "#d9d9d9",
      color: "#000",
      fontSize: "15px",
      fontWeight: "bold",
      textTransform: "uppercase",
      marginLeft: "10px",
      cursor: "pointer"
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      cursor: "pointer"
    },
    dropdown: {
      position: "absolute",
      top: "50px",
      right: 0,
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      zIndex: 999,
      padding: "15px",
      width: "220px"
    },
    dropdownTop: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px"
    },
    dropdownInitials: {
      width: "45px",
      height: "45px",
      borderRadius: "10px",
      backgroundColor: "#d9d9d9",
      color: "#000",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      marginRight: "10px"
    },
    dropdownName: {
      fontWeight: "bold",
      color: "orange",
      fontSize: "16px"
    },
    logoutButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      gap: "6px"
    }
  };

  const pageName = title ?? (pageNames[location.pathname] || "Management System");
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="header">
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {onBack && <button onClick={onBack} className="back-button">Back</button>}
        <h1 style={{ margin: 0 }}>{title ?? pageName}</h1>
      </div>

      <div style={styles.userInfo} onClick={toggleMenu}>
        <h5 style={{ margin: 0 }}>
          Hi, {user.firstName} {user.lastName}
        </h5>
        <div className="header-right" style={styles.avatar}>
          {getInitials()}
        </div>

        {menuOpen && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownTop}>
              <div style={styles.dropdownInitials}>{getInitials()}</div>
              <div style={styles.dropdownName}>
                {user.firstName} {user.lastName}
              </div>
            </div>
            <button style={styles.logoutButton} onClick={logout}>
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
