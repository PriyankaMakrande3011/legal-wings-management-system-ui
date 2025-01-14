import React from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import "./Header.css"; // Import CSS file

const Header = () => {
  const location = useLocation();
  const { user } = useUser();
  // Map paths to page names
  const pageNames = {
    "/calling-team": "Calling Team",
    "/executive-team": "Executive Team",
    "/backend-team": "Backend Team",
    "/dashboard": "Dashboard",
    "/account-team": "Account Team",
    "/marketing-team": "Marketing Team",
    "/clients": "Client",
    "/client-edit": "Client Edit Page",
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
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: "orange",
      color: "#FFFFFF",
      fontSize: "18px",
      fontWeight: "bold",
      textTransform: "uppercase",
      marginLeft: "10px",
    },
  };
  // Get the current page name or default to "Page Not Found"
  const pageName = pageNames[location.pathname] || "Page Not Found";

  return (
    <header className="header">
     <div className="header-left">
      <h1>{pageName}</h1></div>
      <div style={{display:"flex",alignItems:"center", font:"14px"}}>
        <h5>Hii,{user.firstName}{user.lastName}</h5>
<div className="header-right"style={styles.avatar}>
{getInitials()}
</div>
</div>    
    </header>
  );
};

export default Header;
